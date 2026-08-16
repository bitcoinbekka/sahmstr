import { useMutation } from "@tanstack/react-query";
import { BlossomUploader } from '@nostrify/nostrify/uploaders';

import { useCurrentUser } from "./useCurrentUser";

/**
 * Blossom servers we try, in order, until one accepts the upload.
 *
 * A single hardcoded server is a single point of failure — if it is down,
 * rate-limiting, or rejecting a given key, every upload (including Circle
 * photos) fails with no recourse. We try each in turn and only give up if all
 * of them fail, and we surface the real reason when they do.
 */
const BLOSSOM_SERVERS = [
  'https://blossom.primal.net/',
  'https://blossom.band/',
  'https://cdn.satellite.earth/',
  'https://nostr.download/',
];

export function useUploadFile() {
  const { user } = useCurrentUser();

  return useMutation({
    mutationFn: async (file: File) => {
      if (!user) {
        throw new Error('You need to be logged in to upload files.');
      }

      const errors: string[] = [];

      // Try each server in turn; the first success wins.
      for (const server of BLOSSOM_SERVERS) {
        try {
          const uploader = new BlossomUploader({
            servers: [server],
            signer: user.signer,
          });
          const tags = await uploader.upload(file);
          return tags;
        } catch (err) {
          errors.push(
            `${new URL(server).hostname}: ${err instanceof Error ? err.message : 'failed'}`,
          );
        }
      }

      throw new Error(
        `Could not upload to any media host. Tried ${BLOSSOM_SERVERS.length} servers — ${errors.join('; ')}`,
      );
    },
  });
}