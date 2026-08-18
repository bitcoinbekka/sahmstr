import { Wand2, Loader2, Check, Zap, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CONTEXTVM_PROVIDER } from '@/lib/contextvm';

interface AITagButtonProps {
  /** Kick off the tagging request. */
  onTag: () => void;
  /** Current flow stage. */
  stage: 'idle' | 'sending' | 'awaiting-payment' | 'paying' | 'thinking' | 'done' | 'error';
  /** Whether a provider is configured. */
  isConfigured: boolean;
  /** Whether the user has a Lightning wallet connected (contextVM mode only). */
  hasWallet: boolean;
  /**
   * Which backend is active. 'byok' = direct key call (no wallet, no sats);
   * 'contextvm' = sovereign, sats-paid over Nostr.
   */
  mode?: 'byok' | 'contextvm';
  /** Any error message to show. */
  error?: string | null;
  /** Sats paid so far, once > 0. */
  paidSats?: number;
  /** True once tags have been applied to the form. */
  applied?: boolean;
  disabled?: boolean;
}

/**
 * The shared "tag this photo with AI, paid in sats" control. Used by both the
 * wardrobe and the pantry so the sovereign, pay-per-use AI reads consistently.
 *
 * It states the price up front and degrades honestly: when no provider is set
 * up, or no wallet is connected, it explains rather than failing on click.
 */
export function AITagButton({
  onTag,
  stage,
  isConfigured,
  hasWallet,
  mode = 'contextvm',
  error,
  paidSats = 0,
  applied = false,
  disabled = false,
}: AITagButtonProps) {
  const busy = stage === 'sending' || stage === 'thinking' || stage === 'paying';

  // BYOK needs no wallet; only the contextVM (sats) path gates on a wallet.
  const isByok = mode === 'byok';
  const walletBlocked = !isByok && !hasWallet;

  if (!isConfigured) {
    return (
      <div className="rounded-lg border-2 border-dashed bg-muted/30 p-3 text-center">
        <p className="text-xs leading-relaxed text-muted-foreground">
          AI photo tagging is not set up yet. Add a vision AI key in Settings, or
          connect a Lightning wallet to use the sats-paid AI.
        </p>
      </div>
    );
  }

  const label = (() => {
    switch (stage) {
      case 'sending':
        return 'Sending to the AI…';
      case 'paying':
        return 'Paying…';
      case 'thinking':
        return paidSats > 0 ? 'Reading your photo…' : 'Working…';
      default:
        return applied ? 'Filled in by AI — edit anything below' : 'Tag with AI';
    }
  })();

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant={applied ? 'secondary' : 'outline'}
        className="w-full gap-2 rounded-lg"
        onClick={onTag}
        disabled={disabled || busy || walletBlocked}
      >
        {busy ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : applied ? (
          <Check className="h-4 w-4 text-primary" />
        ) : (
          <Wand2 className="h-4 w-4" />
        )}
        {label}
      </Button>

      {walletBlocked ? (
        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <Zap className="h-3 w-3" />
          Connect a Lightning wallet in Settings to use AI tagging.
        </p>
      ) : error ? (
        <p className="text-center text-xs text-destructive">{error}</p>
      ) : paidSats > 0 && stage === 'done' ? (
        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <Check className="h-3 w-3 text-primary" />
          Paid {paidSats} sats. Everything is editable below.
        </p>
      ) : !applied && !busy && isByok ? (
        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <ShieldCheck className="h-3 w-3" />
          Uses your saved AI key. The photo is sent to your chosen provider.
        </p>
      ) : !applied && !busy ? (
        <p className="flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
          <ShieldCheck className="h-3 w-3" />
          About {CONTEXTVM_PROVIDER.estimatedSats} sats, paid straight from your wallet. Private and peer-to-peer.
        </p>
      ) : null}
    </div>
  );
}
