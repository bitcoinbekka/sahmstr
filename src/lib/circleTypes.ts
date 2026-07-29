/**
 * Private family sharing — "the Circle".
 *
 * The problem this solves: a mother wants to share a photo of her children, or
 * a short video of the garden, with her family and a handful of trusted friends
 * — and with nobody else. Posting a kind:20 picture or kind:22 short video to
 * the open network is the opposite of that. Once it is published in the clear it
 * is scraped, indexed, and permanent.
 *
 * How it works:
 *
 *   1. The Circle is a **NIP-51 follow set** (`kind:30000`) with a fixed `d`
 *      identifier. Members are carried as *private* items — NIP-44 encrypted to
 *      the author's own key and stored in `.content` — so even the membership of
 *      your family circle is not public. This is exactly what NIP-51 specifies
 *      private list items for.
 *
 *   2. A shared story is an ordinary picture or video event (NIP-68 `kind:20`,
 *      NIP-71 `kind:22`) built as an **unsigned rumor**, then sealed and gift
 *      wrapped per **NIP-59** once for each recipient, and once more to the
 *      author so she keeps a readable copy. Relays see only `kind:1059` events
 *      signed by throwaway keys. There is no public trace of the content, the
 *      author, or the recipient list.
 *
 * Nothing here needs a custom event kind, which is why NIP.md declares none.
 * A story that reaches a Nostr client implementing NIP-59 and NIP-68 will simply
 * decrypt and display.
 */

import type { NostrEvent } from '@nostrify/nostrify';

/** The `d` identifier of the family circle follow set. */
export const CIRCLE_IDENTIFIER = 'sahmstr-circle';

/** NIP-51 follow set. */
export const KIND_FOLLOW_SET = 30000;

/** NIP-17 / NIP-51 preferred relays for receiving gift wrapped events. */
export const KIND_DM_RELAY_LIST = 10050;

/** NIP-59 seal and gift wrap. */
export const KIND_SEAL = 13;
export const KIND_GIFT_WRAP = 1059;

/** NIP-68 picture-first post. */
export const KIND_PICTURE = 20;

/** NIP-71 short-form portrait video. */
export const KIND_SHORT_VIDEO = 22;

/** The media kinds a Circle story may carry. */
export const STORY_KINDS = [KIND_PICTURE, KIND_SHORT_VIDEO] as const;

/** A member of the family circle. */
export interface CircleMember {
  pubkey: string;
  /** Optional petname, as allowed on NIP-02 style `p` tags. */
  petname?: string;
  /** Optional relay hint. */
  relay?: string;
}

/** A single attached image or video. */
export interface StoryMedia {
  url: string;
  /** MIME type, from the NIP-94 `m` value. */
  mimeType?: string;
  /** SHA-256 of the file, from NIP-94 `x`. */
  sha256?: string;
  /** Blurhash or thumbnail, if the upload provided one. */
  blurhash?: string;
  dim?: string;
  /** Per-image description, for accessibility. */
  alt?: string;
  /**
   * AES-GCM key and nonce, present when the blob was encrypted before upload.
   * These travel only inside the gift wrap, never on a public event.
   */
  decryptionKey?: string;
  decryptionNonce?: string;
}

/** A decrypted story, as rendered in the Circle feed. */
export interface CircleStory {
  /** The rumor id. Stable across every wrap of the same story. */
  id: string;
  /** The true author, recovered from the seal. */
  pubkey: string;
  /** The rumor's own timestamp — the honest one. */
  createdAt: number;
  kind: number;
  /** Caption text. */
  content: string;
  media: StoryMedia[];
  /** Pubkeys this story was addressed to, as recorded by the author. */
  audience: string[];
  /** The gift wrap this was recovered from, for deduplication. */
  wrapId: string;
}

/** Is this a video story rather than a picture story? */
export function isVideoStory(story: CircleStory): boolean {
  return story.kind === KIND_SHORT_VIDEO;
}

/**
 * Pull `imeta` attachments out of a picture or video rumor.
 *
 * NIP-92 packs each attachment into a single `imeta` tag as space-delimited
 * `key value` pairs. NIP-71 video events additionally use `imeta` for their
 * variants, so the same parser serves both.
 */
export function parseImetaTags(tags: string[][]): StoryMedia[] {
  const media: StoryMedia[] = [];

  for (const tag of tags) {
    if (tag[0] !== 'imeta') continue;

    const item: Partial<StoryMedia> = {};

    for (const part of tag.slice(1)) {
      const space = part.indexOf(' ');
      if (space === -1) continue;
      const key = part.slice(0, space);
      const value = part.slice(space + 1);

      switch (key) {
        case 'url':
          item.url = value;
          break;
        case 'm':
          item.mimeType = value;
          break;
        case 'x':
          item.sha256 = value;
          break;
        case 'blurhash':
          item.blurhash = value;
          break;
        case 'dim':
          item.dim = value;
          break;
        case 'alt':
          item.alt = value;
          break;
        case 'decryption-key':
          item.decryptionKey = value;
          break;
        case 'decryption-nonce':
          item.decryptionNonce = value;
          break;
      }
    }

    if (item.url) media.push(item as StoryMedia);
  }

  return media;
}

/** Build the `imeta` tag value list for one attachment. */
export function buildImetaTag(media: StoryMedia): string[] {
  const parts = [`url ${media.url}`];
  if (media.mimeType) parts.push(`m ${media.mimeType}`);
  if (media.sha256) parts.push(`x ${media.sha256}`);
  if (media.blurhash) parts.push(`blurhash ${media.blurhash}`);
  if (media.dim) parts.push(`dim ${media.dim}`);
  if (media.alt) parts.push(`alt ${media.alt}`);
  // Only ever inside a gift wrap — never on a publicly visible event.
  if (media.decryptionKey) parts.push(`decryption-key ${media.decryptionKey}`);
  if (media.decryptionNonce) parts.push(`decryption-nonce ${media.decryptionNonce}`);
  return ['imeta', ...parts];
}

/** True when this attachment needs client-side decryption before display. */
export function isEncryptedMedia(media: StoryMedia): boolean {
  return !!media.decryptionKey && !!media.decryptionNonce;
}

/**
 * A story rumor must have at least one attachment — these are picture and video
 * kinds, so a story with no media is malformed rather than merely empty.
 */
export function validateStoryRumor(rumor: {
  kind?: number;
  tags?: string[][];
}): boolean {
  if (typeof rumor.kind !== 'number') return false;
  if (!STORY_KINDS.includes(rumor.kind as (typeof STORY_KINDS)[number])) return false;
  if (!Array.isArray(rumor.tags)) return false;
  return parseImetaTags(rumor.tags).length > 0;
}

/** Read the private member list out of a decrypted NIP-51 content payload. */
export function parsePrivateMembers(tags: string[][]): CircleMember[] {
  return tags
    .filter((t) => t[0] === 'p' && typeof t[1] === 'string' && t[1].length === 64)
    .map((t) => ({
      pubkey: t[1],
      relay: t[2] || undefined,
      petname: t[3] || undefined,
    }));
}

/** Gift wraps addressed to a pubkey, newest first, deduplicated by id. */
export function sortWraps(wraps: NostrEvent[]): NostrEvent[] {
  const seen = new Set<string>();
  return wraps
    .filter((w) => {
      if (seen.has(w.id)) return false;
      seen.add(w.id);
      return true;
    })
    .sort((a, b) => b.created_at - a.created_at);
}
