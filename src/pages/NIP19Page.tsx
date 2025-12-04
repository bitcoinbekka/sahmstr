import { nip19 } from 'nostr-tools';
import { useParams } from 'react-router-dom';
import NotFound from './NotFound';
import { RecipeView } from './RecipeView';

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
      // Check if this is a recipe (kind 30023)
      if (data.kind === 30023) {
        return <RecipeView naddr={data} />;
      }
      // Other addressable events placeholder
      return <div>Addressable event placeholder</div>;

    default:
      return <NotFound />;
  }
}