import { describe, it, expect } from 'vitest';
import {
  buildImetaTag,
  parseImetaTags,
  isEncryptedMedia,
  validateStoryRumor,
  parsePrivateMembers,
  sortWraps,
  KIND_PICTURE,
  KIND_SHORT_VIDEO,
  type StoryMedia,
} from './circleTypes';
import type { NostrEvent } from '@nostrify/nostrify';

describe('imeta round-trip', () => {
  it('preserves every field, including the decryption key', () => {
    const media: StoryMedia = {
      url: 'https://blossom.example/abc.bin',
      mimeType: 'image/jpeg',
      sha256: 'a'.repeat(64),
      dim: '1024x768',
      blurhash: 'LEHV6nWB2yk8',
      alt: 'The children in the garden',
      decryptionKey: 'k3y+base64==',
      decryptionNonce: 'n0nce+b64',
    };

    const [parsed] = parseImetaTags([buildImetaTag(media)]);

    expect(parsed).toEqual(media);
    expect(isEncryptedMedia(parsed)).toBe(true);
  });

  it('handles values containing spaces, since imeta is space-delimited', () => {
    const media: StoryMedia = {
      url: 'https://blossom.example/x.bin',
      alt: 'A caption with several spaces in it',
    };

    const [parsed] = parseImetaTags([buildImetaTag(media)]);
    expect(parsed.alt).toBe('A caption with several spaces in it');
  });

  it('ignores imeta entries with no url', () => {
    expect(parseImetaTags([['imeta', 'm image/png']])).toEqual([]);
  });

  it('ignores non-imeta tags', () => {
    expect(parseImetaTags([['p', 'abc'], ['title', 'hello']])).toEqual([]);
  });

  it('treats unencrypted media as unencrypted', () => {
    expect(isEncryptedMedia({ url: 'https://x/y.jpg' })).toBe(false);
    // A key without a nonce is unusable and must not count as encrypted.
    expect(isEncryptedMedia({ url: 'https://x/y.jpg', decryptionKey: 'k' })).toBe(false);
  });
});

describe('validateStoryRumor', () => {
  const withMedia = [buildImetaTag({ url: 'https://blossom.example/a.bin' })];

  it('accepts picture and short video kinds with media', () => {
    expect(validateStoryRumor({ kind: KIND_PICTURE, tags: withMedia })).toBe(true);
    expect(validateStoryRumor({ kind: KIND_SHORT_VIDEO, tags: withMedia })).toBe(true);
  });

  it('rejects a story with no attachment', () => {
    expect(validateStoryRumor({ kind: KIND_PICTURE, tags: [['alt', 'nothing']] })).toBe(
      false,
    );
  });

  it('rejects unrelated kinds, so a wrapped DM cannot render as a story', () => {
    expect(validateStoryRumor({ kind: 1, tags: withMedia })).toBe(false);
    expect(validateStoryRumor({ kind: 14, tags: withMedia })).toBe(false);
  });

  it('rejects malformed input', () => {
    expect(validateStoryRumor({})).toBe(false);
    expect(validateStoryRumor({ kind: KIND_PICTURE })).toBe(false);
  });
});

describe('parsePrivateMembers', () => {
  it('reads pubkey, relay and petname positionally', () => {
    const members = parsePrivateMembers([
      ['p', 'b'.repeat(64), 'wss://relay.example', 'Mum'],
      ['p', 'c'.repeat(64)],
    ]);

    expect(members).toEqual([
      { pubkey: 'b'.repeat(64), relay: 'wss://relay.example', petname: 'Mum' },
      { pubkey: 'c'.repeat(64), relay: undefined, petname: undefined },
    ]);
  });

  it('discards entries that are not 32-byte hex keys', () => {
    expect(
      parsePrivateMembers([
        ['p', 'too-short'],
        ['p', ''],
        ['relay', 'wss://x'],
      ]),
    ).toEqual([]);
  });
});

describe('sortWraps', () => {
  const wrap = (id: string, created_at: number) =>
    ({ id, created_at }) as NostrEvent;

  it('deduplicates by id and sorts newest first', () => {
    const result = sortWraps([
      wrap('a', 100),
      wrap('b', 300),
      wrap('a', 100),
      wrap('c', 200),
    ]);

    expect(result.map((w) => w.id)).toEqual(['b', 'c', 'a']);
  });
});
