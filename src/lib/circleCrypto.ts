/**
 * File encryption for Circle media.
 *
 * Gift wrapping hides the caption, the author, the audience, and the URL of an
 * attachment — but the attachment itself is a blob sitting on a public Blossom
 * server. A sha256 URL is unguessable in practice, but "unguessable" is not
 * "private": anyone who is ever shown the URL keeps access forever, and the
 * server operator can read every file.
 *
 * For a feature whose entire premise is that a photo of your children does not
 * go to the open network, that is not good enough. So the bytes are encrypted
 * before upload with AES-GCM, and the key travels only inside the gift wrap.
 * The server stores ciphertext it cannot read.
 *
 * This follows the scheme NIP-17 defines for `kind:15` file messages —
 * `aes-gcm` with a `decryption-key` and `decryption-nonce` carried on the
 * event — so the approach is the one already standardised for private files.
 */

/** The algorithm NIP-17 names for encrypted file messages. */
export const ENCRYPTION_ALGORITHM = 'aes-gcm';

/** AES-GCM standard nonce length, in bytes. */
const NONCE_BYTES = 12;

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export interface EncryptedFile {
  /** The ciphertext, ready to upload. */
  file: File;
  /** Base64 AES-GCM key, to be carried inside the gift wrap only. */
  key: string;
  /** Base64 nonce. */
  nonce: string;
  /** The original MIME type, which the ciphertext no longer reveals. */
  mimeType: string;
}

/**
 * Encrypt a file for Circle sharing.
 *
 * The uploaded blob is given a generic name and `application/octet-stream`
 * type, so the server learns nothing from the metadata either.
 */
export async function encryptFile(file: File): Promise<EncryptedFile> {
  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, [
    'encrypt',
    'decrypt',
  ]);

  const nonce = crypto.getRandomValues(new Uint8Array(NONCE_BYTES));
  const plaintext = await file.arrayBuffer();

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: nonce },
    key,
    plaintext,
  );

  const rawKey = new Uint8Array(await crypto.subtle.exportKey('raw', key));

  return {
    file: new File([ciphertext], 'blob.bin', { type: 'application/octet-stream' }),
    key: toBase64(rawKey),
    nonce: toBase64(nonce),
    mimeType: file.type || 'application/octet-stream',
  };
}

/**
 * Fetch and decrypt a Circle attachment, returning a blob URL for display.
 *
 * Callers must revoke the returned URL when the element unmounts, or the blob
 * is retained for the lifetime of the document.
 */
export async function decryptToBlobUrl(
  url: string,
  keyB64: string,
  nonceB64: string,
  mimeType: string,
): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Could not fetch attachment (${response.status})`);
  }

  const ciphertext = await response.arrayBuffer();

  const key = await crypto.subtle.importKey(
    'raw',
    fromBase64(keyB64),
    { name: 'AES-GCM' },
    false,
    ['decrypt'],
  );

  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64(nonceB64) },
    key,
    ciphertext,
  );

  return URL.createObjectURL(new Blob([plaintext], { type: mimeType }));
}
