import { describe, it, expect, vi, afterEach } from 'vitest';
import { encryptFile, decryptToBlobUrl, ENCRYPTION_ALGORITHM } from './circleCrypto';

/**
 * These tests exercise the real WebCrypto implementation in jsdom, so a genuine
 * round trip is verified rather than a mock of one.
 */

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('encryptFile', () => {
  it('produces ciphertext that does not contain the plaintext', async () => {
    const plaintext = 'the children in the garden, June';
    const file = new File([plaintext], 'photo.jpg', { type: 'image/jpeg' });

    const result = await encryptFile(file);
    const bytes = new Uint8Array(await result.file.arrayBuffer());
    const asText = new TextDecoder().decode(bytes);

    expect(asText).not.toContain('children');
    expect(result.key).toBeTruthy();
    expect(result.nonce).toBeTruthy();
  });

  it('strips identifying metadata from the uploaded blob', async () => {
    const file = new File(['x'], 'our-family-holiday.jpg', { type: 'image/jpeg' });
    const result = await encryptFile(file);

    // The server should learn nothing from the filename or content type.
    expect(result.file.name).toBe('blob.bin');
    expect(result.file.type).toBe('application/octet-stream');
    // The true type is retained for the recipient, inside the gift wrap.
    expect(result.mimeType).toBe('image/jpeg');
  });

  it('uses a fresh key and nonce for every file', async () => {
    const a = await encryptFile(new File(['x'], 'a.jpg', { type: 'image/jpeg' }));
    const b = await encryptFile(new File(['x'], 'b.jpg', { type: 'image/jpeg' }));

    expect(a.key).not.toBe(b.key);
    expect(a.nonce).not.toBe(b.nonce);
  });

  it('names the algorithm NIP-17 specifies', () => {
    expect(ENCRYPTION_ALGORITHM).toBe('aes-gcm');
  });
});

describe('decryptToBlobUrl', () => {
  it('recovers the original bytes exactly', async () => {
    const original = 'a caption and some binary \u0000\u00ff bytes';
    const file = new File([original], 'photo.jpg', { type: 'image/jpeg' });

    const encrypted = await encryptFile(file);
    const ciphertext = await encrypted.file.arrayBuffer();

    // Stand in for the Blossom host.
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, arrayBuffer: async () => ciphertext }),
    );

    const captured: Blob[] = [];
    vi.stubGlobal('URL', {
      ...URL,
      createObjectURL: (blob: Blob) => {
        captured.push(blob);
        return 'blob:mock';
      },
      revokeObjectURL: () => {},
    });

    const url = await decryptToBlobUrl(
      'https://blossom.example/x.bin',
      encrypted.key,
      encrypted.nonce,
      encrypted.mimeType,
    );

    expect(url).toBe('blob:mock');
    expect(captured).toHaveLength(1);
    expect(await captured[0].text()).toBe(original);
    // The recipient gets a blob typed as the real media type, so it renders.
    expect(captured[0].type).toBe('image/jpeg');
  });

  it('rejects a wrong key rather than returning garbage', async () => {
    const encrypted = await encryptFile(
      new File(['secret'], 'a.jpg', { type: 'image/jpeg' }),
    );
    const other = await encryptFile(new File(['x'], 'b.jpg', { type: 'image/jpeg' }));
    const ciphertext = await encrypted.file.arrayBuffer();

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, arrayBuffer: async () => ciphertext }),
    );

    // AES-GCM is authenticated, so a wrong key must fail the tag check.
    await expect(
      decryptToBlobUrl('https://x/y.bin', other.key, encrypted.nonce, 'image/jpeg'),
    ).rejects.toBeDefined();
  });

  it('surfaces a fetch failure with the status', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 404 }));

    await expect(
      decryptToBlobUrl('https://x/gone.bin', 'k', 'n', 'image/jpeg'),
    ).rejects.toThrow(/404/);
  });
});
