import { nip19 } from 'nostr-tools';
import { useParams } from 'react-router-dom';
import NotFound from './NotFound';
import { LongFormRouter } from './LongFormRouter';
import { StreamPage } from './StreamPage';
import { KIND_LIVE_EVENT } from '@/lib/streamTypes';

export function NIP19Page() {
  const { nip19: identifier } = useParams<{ nip19: string }>();

  if (!identifier) {
    return <NotFound />;
  }

  let decoded;
  try {
    decoded = nip19.decode(identifier);
  } catch {
    return <NotFound />;
  }

  const { type, data } = decoded;

  switch (type) {
    case 'npub':
    case 'nprofile':
      // Profile view placeholder
      return <div>Profile placeholder</div>;

    case 'note':
      // Note view placeholder
      return <div>Note placeholder</div>;

    case 'nevent':
      // Event view placeholder
      return <div>Event placeholder</div>;

    case 'naddr':
      // Recipes and contributed curriculum units are both kind 30023;
      // LongFormRouter resolves the event and picks the right view.
      if (data.kind === 30023) {
        return <LongFormRouter naddr={data} />;
      }
      // Live streams (NIP-53) are addressable kind:30311.
      if (data.kind === KIND_LIVE_EVENT) {
        return <StreamPage address={data} />;
      }
      // Other addressable events placeholder
      return <div>Addressable event placeholder</div>;

    default:
      return <NotFound />;
  }
}