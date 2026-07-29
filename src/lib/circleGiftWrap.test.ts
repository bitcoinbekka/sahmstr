import { describe, it, expect } from 'vitest';
import { NSecSigner } from '@nostrify/nostrify';
import { generateSecretKey, getEventHash, getPublicKey } from 'nostr-tools';
import {
  KIND_GIFT_WRAP,
  KIND_SEAL,
  KIND_PICTURE,
  buildImetaTag,
  parseImetaTags,
  validateStoryRumor,
} from './circleTypes';

/**
 * An end-to-end exercise of the NIP-59 layering the Circle depends on.
 *
 * This mirrors what `usePublishStory` and `useCircleStories` do, without React,
 * so the cryptography and the security checks are verified independently of the
 * UI. If this suite passes, a story really can be sealed by one party and opened
 * only by the intended recipient.
 */

const alice = generateSecretKey();
const bob = generateSecretKey();
const eve = generateSecretKey();

const alicePub = getPublicKey(alice);
const bobPub = getPublicKey(bob);

const aliceSigner = new NSecSigner(alice);
const bobSigner = new NSecSigner(bob);
const eveSigner = new NSecSigner(eve);

/** Build the rumor, seal and wrap exactly as the publish hook does. */
async function wrapStory(recipient: string, caption = 'The garden in June') {
  const tags = [
    buildImetaTag({
      url: 'https://blossom.example/a.bin',
      mimeType: 'image/jpeg',
      decryptionKey: 'key-b64',
      decryptionNonce: 'nonce-b64',
    }),
    ['alt', caption],
  ];

  const base = {
    kind: KIND_PICTURE,
    content: caption,
    tags,
    created_at: Math.floor(Date.now() / 1000),
    pubkey: alicePub,
  };
  const rumor = { ...base, id: getEventHash(base) };

  const seal = await aliceSigner.signEvent({
    kind: KIND_SEAL,
    content: await aliceSigner.nip44!.encrypt(recipient, JSON.stringify(rumor)),
    created_at: Math.floor(Date.now() / 1000) - 3600,
    tags: [],
  });

  const throwaway = new NSecSigner(generateSecretKey());
  const wrap = await throwaway.signEvent({
    kind: KIND_GIFT_WRAP,
    content: await throwaway.nip44!.encrypt(recipient, JSON.stringify(seal)),
    created_at: Math.floor(Date.now() / 1000) - 7200,
    tags: [['p', recipient]],
  });

  return { rumor, seal, wrap };
}

/** Unwrap exactly as the read hook does, including the impersonation check. */
async function unwrapStory(wrap: { pubkey: string; content: string }, signer: NSecSigner) {
  const sealJson = await signer.nip44!.decrypt(wrap.pubkey, wrap.content);
  const seal = JSON.parse(sealJson);

  if (seal.kind !== KIND_SEAL) throw new Error('not a seal');

  const rumorJson = await signer.nip44!.decrypt(seal.pubkey, seal.content);
  const rumor = JSON.parse(rumorJson);

  // NIP-17: the seal's signer must match the rumor's claimed author.
  if (rumor.pubkey !== seal.pubkey) throw new Error('impersonation');
  if (!validateStoryRumor(rumor)) throw new Error('invalid story');

  return rumor;
}

describe('gift wrapped story round trip', () => {
  it('lets the intended recipient recover the story and its media key', async () => {
    const { wrap } = await wrapStory(bobPub);
    const rumor = await unwrapStory(wrap, bobSigner);

    expect(rumor.pubkey).toBe(alicePub);
    expect(rumor.content).toBe('The garden in June');

    const [media] = parseImetaTags(rumor.tags);
    expect(media.decryptionKey).toBe('key-b64');
    expect(media.decryptionNonce).toBe('nonce-b64');
  });

  it('lets the author read her own copy', async () => {
    const { wrap } = await wrapStory(alicePub);
    const rumor = await unwrapStory(wrap, aliceSigner);
    expect(rumor.pubkey).toBe(alicePub);
  });

  it('leaks nothing on the outer event', async () => {
    const { wrap } = await wrapStory(bobPub);

    // The wrap is signed by a throwaway key, not by the author.
    expect(wrap.pubkey).not.toBe(alicePub);
    expect(wrap.kind).toBe(KIND_GIFT_WRAP);

    // Only the recipient is referenced; the caption and author are ciphertext.
    expect(wrap.tags).toEqual([['p', bobPub]]);
    expect(wrap.content).not.toContain('garden');
    expect(wrap.content).not.toContain(alicePub);

    // Timestamps are pushed into the past, never the future.
    expect(wrap.created_at).toBeLessThanOrEqual(Math.floor(Date.now() / 1000));
  });

  it('cannot be opened by someone outside the circle', async () => {
    const { wrap } = await wrapStory(bobPub);
    await expect(unwrapStory(wrap, eveSigner)).rejects.toBeDefined();
  });

  it('rejects a forged rumor claiming another author', async () => {
    // Eve seals a rumor that claims to be from Alice.
    const base = {
      kind: KIND_PICTURE,
      content: 'Not really from Alice',
      tags: [buildImetaTag({ url: 'https://blossom.example/x.bin' })],
      created_at: Math.floor(Date.now() / 1000),
      pubkey: alicePub,
    };
    const forged = { ...base, id: getEventHash(base) };

    const seal = await eveSigner.signEvent({
      kind: KIND_SEAL,
      content: await eveSigner.nip44!.encrypt(bobPub, JSON.stringify(forged)),
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
    });

    const throwaway = new NSecSigner(generateSecretKey());
    const wrap = await throwaway.signEvent({
      kind: KIND_GIFT_WRAP,
      content: await throwaway.nip44!.encrypt(bobPub, JSON.stringify(seal)),
      created_at: Math.floor(Date.now() / 1000),
      tags: [['p', bobPub]],
    });

    // Bob can decrypt it, but the mismatch must be caught.
    await expect(unwrapStory(wrap, bobSigner)).rejects.toThrow('impersonation');
  });

  it('rejects a wrapped event that is not a story', async () => {
    const base = {
      kind: 14, // a DM, not a story
      content: 'hello',
      tags: [],
      created_at: Math.floor(Date.now() / 1000),
      pubkey: alicePub,
    };
    const rumor = { ...base, id: getEventHash(base) };

    const seal = await aliceSigner.signEvent({
      kind: KIND_SEAL,
      content: await aliceSigner.nip44!.encrypt(bobPub, JSON.stringify(rumor)),
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
    });

    const throwaway = new NSecSigner(generateSecretKey());
    const wrap = await throwaway.signEvent({
      kind: KIND_GIFT_WRAP,
      content: await throwaway.nip44!.encrypt(bobPub, JSON.stringify(seal)),
      created_at: Math.floor(Date.now() / 1000),
      tags: [['p', bobPub]],
    });

    await expect(unwrapStory(wrap, bobSigner)).rejects.toThrow('invalid story');
  });

  it('produces a distinct wrap per recipient but one stable rumor id', async () => {
    const forBob = await wrapStory(bobPub, 'same story');
    const forAlice = await wrapStory(alicePub, 'same story');

    // Different envelopes...
    expect(forBob.wrap.id).not.toBe(forAlice.wrap.id);
    expect(forBob.wrap.pubkey).not.toBe(forAlice.wrap.pubkey);

    // ...same underlying story, which is what deduplication relies on.
    expect(forBob.rumor.id).toBe(forAlice.rumor.id);
  });
});
