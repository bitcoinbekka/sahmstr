/**
 * contextVM client — sats-native AI over Nostr.
 *
 * contextVM (the "Context Vending Machine") runs the Model Context Protocol
 * (MCP) over Nostr: a client and an AI server exchange JSON-RPC messages inside
 * ephemeral **kind:25910** events, addressed by pubkey and correlated by event
 * id. Priced capabilities follow **CEP-8**: the server answers a call with a
 * `notifications/payment_required` carrying a Lightning invoice, the client pays
 * it (here, through the user's NWC wallet), and the server then returns the
 * result.
 *
 * This keeps SAHMstr's AI features fully sovereign and backend-free on the app
 * side: there is no server we operate, no API key in the bundle, and payment is
 * peer-to-peer in sats. The AI itself is run by a contextVM server we point at
 * via `CONTEXTVM_PROVIDER` — initially our own, on our VPS.
 *
 * Only the slice of contextVM/MCP that this app needs is implemented: a single
 * `tools/call` invocation with the transparent CEP-8 payment lifecycle.
 */

/** ContextVM's unified event kind — all MCP messages ride in these. */
export const KIND_CONTEXTVM = 25910;

/** CEP-8 payment notification methods (transparent lifecycle). */
export const PAYMENT_REQUIRED = 'notifications/payment_required';
export const PAYMENT_ACCEPTED = 'notifications/payment_accepted';
export const PAYMENT_REJECTED = 'notifications/payment_rejected';

/**
 * Where the AI lives. This is intentionally a single, swappable constant: point
 * it at our own contextVM server once it is running on the VPS, or at any other
 * provider, with no other code change.
 *
 * `pubkey` is the server's hex Nostr public key; `relays` are where it listens.
 * `toolName` is the MCP tool the server exposes for vision tagging.
 */
export interface ContextVMProvider {
  pubkey: string;
  relays: string[];
  /** The MCP tool name the server exposes for image tagging. */
  toolName: string;
  /** A rough guide price, shown to the user before they commit. Sats. */
  estimatedSats: number;
}

/**
 * The SAHMstr AI provider. Empty pubkey until our server is live — the UI
 * detects this and shows "AI tagging is not available yet" rather than failing.
 */
export const CONTEXTVM_PROVIDER: ContextVMProvider = {
  // TODO: set to the SAHMstr contextVM server's hex pubkey once deployed.
  pubkey: '',
  relays: ['wss://relay.sahmstr.com'],
  toolName: 'tag_image',
  estimatedSats: 25,
};

/** Is a provider configured and usable? */
export function isProviderConfigured(p: ContextVMProvider = CONTEXTVM_PROVIDER): boolean {
  return /^[0-9a-f]{64}$/i.test(p.pubkey) && p.relays.length > 0;
}

/** A CEP-8 payment request pulled from a payment_required notification. */
export interface PaymentRequest {
  amount: number;
  /** Opaque payment string; for Lightning this is a bolt11 invoice. */
  pay_req: string;
  pmi: string;
  description?: string;
}

/** Extract a bolt11 invoice from a CEP-8 payment_required params object. */
export function parsePaymentRequest(params: unknown): PaymentRequest | null {
  if (typeof params !== 'object' || params === null) return null;
  const p = params as Record<string, unknown>;
  if (typeof p.pay_req !== 'string' || typeof p.pmi !== 'string') return null;
  return {
    amount: typeof p.amount === 'number' ? p.amount : 0,
    pay_req: p.pay_req,
    pmi: p.pmi,
    description: typeof p.description === 'string' ? p.description : undefined,
  };
}

/**
 * Build the MCP `tools/call` request body for a vision tagging request.
 * The image is passed as a data URL or https URL the server can fetch/inline;
 * `instruction` steers what the server should return.
 */
export function buildToolCall(args: {
  id: number;
  toolName: string;
  imageUrl: string;
  instruction: string;
}) {
  return {
    jsonrpc: '2.0' as const,
    id: args.id,
    method: 'tools/call',
    params: {
      name: args.toolName,
      arguments: {
        image_url: args.imageUrl,
        instruction: args.instruction,
      },
    },
  };
}

/**
 * Pull the text payload out of an MCP tools/call result. MCP returns
 * `result.content: [{ type: 'text', text: '...' }, ...]`; we concatenate the
 * text parts, which is where the server puts its JSON answer.
 */
export function extractToolText(result: unknown): string {
  if (typeof result !== 'object' || result === null) return '';
  const r = result as Record<string, unknown>;
  const content = r.content;
  if (!Array.isArray(content)) return '';
  return content
    .map((part) => {
      if (typeof part === 'object' && part !== null && 'text' in part) {
        const t = (part as Record<string, unknown>).text;
        return typeof t === 'string' ? t : '';
      }
      return '';
    })
    .join('');
}
