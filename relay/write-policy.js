#!/usr/bin/env node
/**
 * SAHMstr relay write policy (strfry plugin).
 *
 * strfry runs this script once and streams it one JSON request per line on
 * stdin, each describing an event someone is trying to write. We reply on
 * stdout with `{ "id": <event id>, "action": "accept" | "reject", "msg": "" }`.
 *
 * Reading is NOT affected by this — anyone can read from the relay. This only
 * governs who may WRITE.
 *
 * Our policy, in plain terms:
 *
 *   1. Allowlisted authors may write anything. This is you and the family /
 *      community members you trust. Add their HEX pubkeys to ALLOWLIST below.
 *
 *   2. ANYONE may write gift wraps (kind 1059). This is deliberate and
 *      important: a gift wrap is how a private Circle story or DM is delivered
 *      TO one of your users. The sender might be on any app, and the wrap is
 *      signed by a throwaway key, so we cannot allowlist them. The content is
 *      encrypted and addressed to a specific recipient, so accepting these
 *      does not create a spam surface in the normal sense — a wrap with no
 *      valid recipient is simply never read.
 *
 *   3. Everything else from a non-allowlisted author is rejected. That keeps
 *      the relay from becoming an open dumping ground while still letting the
 *      whole world deliver private mail to your users.
 *
 * To turn this into a fully open relay later, set OPEN_WRITE = true.
 * To add someone, put their hex pubkey (64 chars, lowercase) in ALLOWLIST.
 * Get a hex pubkey from an npub at https://nostrtool.com or with nak:
 *   nak decode npub1...
 */

'use strict';

// Flip to true to accept writes from anyone (no allowlist). Off by default.
const OPEN_WRITE = false;

// Hex public keys allowed to publish anything. Lowercase, 64 hex chars.
// Add yourself first, then trusted contributors.
const ALLOWLIST = new Set([
  // 'your_hex_pubkey_here',
  // 'another_trusted_hex_pubkey',
]);

// Kinds that ANYONE may write, regardless of the allowlist. Gift wraps must be
// here so private Circle stories and DMs can be delivered to your users.
const PUBLIC_WRITE_KINDS = new Set([
  1059, // NIP-59 gift wrap (Circle stories, DMs)
]);

const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });

rl.on('line', (line) => {
  let req;
  try {
    req = JSON.parse(line);
  } catch {
    return; // Ignore anything that isn't valid JSON.
  }

  // strfry sends { type: "new", event: {...}, ... }. We only police new writes.
  if (req.type !== 'new') {
    return;
  }

  const event = req.event || {};
  const accept = (msg = '') =>
    process.stdout.write(JSON.stringify({ id: event.id, action: 'accept', msg }) + '\n');
  const reject = (msg) =>
    process.stdout.write(JSON.stringify({ id: event.id, action: 'reject', msg }) + '\n');

  if (OPEN_WRITE) {
    return accept();
  }

  // Anyone may deliver a gift wrap (private mail) to our users.
  if (PUBLIC_WRITE_KINDS.has(event.kind)) {
    return accept();
  }

  // Allowlisted authors may write anything.
  if (typeof event.pubkey === 'string' && ALLOWLIST.has(event.pubkey.toLowerCase())) {
    return accept();
  }

  return reject('restricted: this relay only accepts writes from members. Private (gift-wrapped) messages to members are always accepted.');
});
