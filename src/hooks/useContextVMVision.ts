/**
 * useContextVMVision — run a paid vision-tagging request over contextVM.
 *
 * The whole sats-native AI flow, in one hook:
 *
 *   1. Publish an MCP `tools/call` request to the provider (kind:25910),
 *      encrypted to the provider's pubkey.
 *   2. Listen for the provider's replies on its relays.
 *   3. On a CEP-8 `payment_required`, pay the Lightning invoice with the user's
 *      NWC wallet, then keep waiting.
 *   4. On the `tools/call` result, return the text payload for the caller to
 *      parse into tags.
 *
 * Everything is peer-to-peer: no backend of ours, no API key in the bundle,
 * payment in sats straight from the user's wallet to the provider.
 */

import { useCallback, useState } from 'react';
import { useNostr } from '@nostrify/react';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useWallet } from '@/hooks/useWallet';
import { useNWC } from '@/hooks/useNWCContext';
import {
  KIND_CONTEXTVM,
  PAYMENT_REQUIRED,
  PAYMENT_ACCEPTED,
  PAYMENT_REJECTED,
  CONTEXTVM_PROVIDER,
  isProviderConfigured,
  buildToolCall,
  extractToolText,
  parsePaymentRequest,
  type ContextVMProvider,
} from '@/lib/contextvm';

/** How long we wait, end to end, before giving up on a request. */
const REQUEST_TIMEOUT_MS = 90_000;

export interface VisionResult {
  /** The raw text the tool returned (JSON the caller will parse). */
  text: string;
  /** Sats actually paid, if any. */
  paidSats: number;
}

type Stage = 'idle' | 'sending' | 'awaiting-payment' | 'paying' | 'thinking' | 'done' | 'error';

interface JsonRpcMessage {
  jsonrpc: string;
  id?: number | string;
  method?: string;
  params?: unknown;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

export function useContextVMVision(provider: ContextVMProvider = CONTEXTVM_PROVIDER) {
  const { nostr } = useNostr();
  const { user } = useCurrentUser();
  const { hasNWC, activeNWC } = useWallet();
  const { sendPayment } = useNWC();

  const [stage, setStage] = useState<Stage>('idle');
  const [error, setError] = useState<string | null>(null);
  const [paidSats, setPaidSats] = useState(0);

  const configured = isProviderConfigured(provider);

  const reset = useCallback(() => {
    setStage('idle');
    setError(null);
    setPaidSats(0);
  }, []);

  const tagImage = useCallback(
    async (imageUrl: string, instruction: string): Promise<VisionResult | null> => {
      setError(null);
      setPaidSats(0);

      if (!configured) {
        setError('AI tagging is not available yet — no provider is configured.');
        setStage('error');
        return null;
      }
      if (!user?.signer.nip44) {
        setError('You need to be logged in with a NIP-44 capable signer to use AI tagging.');
        setStage('error');
        return null;
      }
      if (!hasNWC || !activeNWC) {
        setError('Connect a Lightning wallet (NWC) to pay for AI tagging.');
        setStage('error');
        return null;
      }

      const signer = user.signer;
      const requestId = Math.floor(Math.random() * 1e9);
      const group = nostr.group(provider.relays);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      let totalPaid = 0;

      try {
        setStage('sending');

        // Build and encrypt the MCP tools/call request to the provider.
        const call = buildToolCall({
          id: requestId,
          toolName: provider.toolName,
          imageUrl,
          instruction,
        });
        const encrypted = await signer.nip44!.encrypt(
          provider.pubkey,
          JSON.stringify(call),
        );

        const requestEvent = await signer.signEvent({
          kind: KIND_CONTEXTVM,
          content: encrypted,
          created_at: Math.floor(Date.now() / 1000),
          tags: [
            ['p', provider.pubkey],
            // Advertise that we can settle Lightning bolt11 invoices.
            ['pmi', 'bitcoin-lightning-bolt11'],
            ['encrypted'],
          ],
        });

        await group.event(requestEvent, { signal: controller.signal });
        setStage('thinking');

        // Listen for the provider's replies, correlated to our request event id.
        const sub = group.req(
          [
            {
              kinds: [KIND_CONTEXTVM],
              authors: [provider.pubkey],
              '#e': [requestEvent.id],
            },
          ],
          { signal: controller.signal },
        );

        for await (const msg of sub) {
          if (msg[0] !== 'EVENT') continue;
          const event = msg[2];

          // Decrypt the reply (contextVM replies are encrypted back to us).
          let payload: JsonRpcMessage | null = null;
          try {
            const text = event.content
              ? await signer.nip44!.decrypt(provider.pubkey, event.content)
              : '';
            payload = JSON.parse(text) as JsonRpcMessage;
          } catch {
            continue; // Not something we can read; ignore.
          }
          if (!payload) continue;

          // --- CEP-8: the provider is asking to be paid ---
          if (payload.method === PAYMENT_REQUIRED) {
            const pay = parsePaymentRequest(payload.params);
            if (!pay) continue;

            setStage('paying');
            try {
              await sendPayment(activeNWC, pay.pay_req);
              totalPaid += pay.amount;
              setPaidSats(totalPaid);
              setStage('thinking');
            } catch (payErr) {
              throw new Error(
                payErr instanceof Error
                  ? `Payment failed: ${payErr.message}`
                  : 'Payment failed.',
              );
            }
            continue;
          }

          if (payload.method === PAYMENT_ACCEPTED) {
            // Receipt acknowledged; keep waiting for the result.
            continue;
          }

          if (payload.method === PAYMENT_REJECTED) {
            throw new Error('The AI provider rejected the payment. Please try again.');
          }

          // --- The actual tool result (correlated by our JSON-RPC id) ---
          if (payload.id === requestId) {
            if (payload.error) {
              throw new Error(payload.error.message || 'The AI provider returned an error.');
            }
            const text = extractToolText(payload.result);
            if (!text) {
              throw new Error('The AI provider returned an empty result.');
            }
            setStage('done');
            return { text, paidSats: totalPaid };
          }
        }

        // Stream ended without a result.
        throw new Error('No response from the AI provider. Please try again.');
      } catch (err) {
        if (controller.signal.aborted) {
          setError('The request timed out. Please try again.');
        } else {
          setError(err instanceof Error ? err.message : 'Something went wrong.');
        }
        setStage('error');
        return null;
      } finally {
        clearTimeout(timeout);
      }
    },
    [configured, user, hasNWC, activeNWC, nostr, provider, sendPayment],
  );

  return {
    tagImage,
    stage,
    error,
    paidSats,
    reset,
    isConfigured: configured,
    /** True while any network/payment work is in flight. */
    isBusy: stage === 'sending' || stage === 'thinking' || stage === 'paying' || stage === 'awaiting-payment',
  };
}
