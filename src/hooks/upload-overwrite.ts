import type { CollectionBeforeOperationHook } from 'payload'

/**
 * Keeps an entry in step with a same-name re-upload.
 *
 * Each upload normally gets a folder of its own in Vercel Blob (`_objectKey`) and a filename
 * made unique with a `-1`, `-2`… suffix. When the file has the same name as an existing entry,
 * Payload 3.92 treats it as an overwrite instead: the browser puts it straight under the
 * collection's prefix, under the plain name, with no folder. The entry then disagrees with the
 * file twice: on an update it keeps its old `_objectKey`, and the stored filename still gets a
 * suffix, because the uniqueness check doesn't exclude the entry being updated. Its URL points at
 * a folder and a name the file doesn't have, and Blob answers "not found".
 *
 * This runs before Payload copies the old key back from the entry and before it renames the
 * file: it clears the key and sets `overwriteExistingFiles`, Payload's own flag for a replacing
 * upload, which keeps the plain filename. An image's sizes are then named and stored from that
 * same folder and name, so they stay in step as well.
 *
 * `req.file.clientUploadContext` is the receipt the server signed when it issued the upload, so
 * `allowOverwrite` can't be set from the browser. Remove this once Payload's overwrite path
 * accounts for `_objectKey` and the filename (storage-vercel-blob's authorizeFileOverwrite).
 */
export const keepOverwriteInFolder: CollectionBeforeOperationHook = ({ args, req }) => {
  const upload = req.file?.clientUploadContext
  const overwrite =
    typeof upload === 'object' && upload !== null && 'allowOverwrite' in upload && upload.allowOverwrite === true
  if (!overwrite || !('data' in args) || typeof args.data !== 'object' || args.data === null) return args
  return { ...args, overwriteExistingFiles: true, data: { ...args.data, _objectKey: null } }
}

/** Spread into an upload collection's `hooks`. */
export const overwriteHooks = { beforeOperation: [keepOverwriteInFolder] }
