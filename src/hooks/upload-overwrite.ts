import type { CollectionBeforeOperationHook } from 'payload'

/**
 * Keeps an entry's storage folder in step with a same-name re-upload.
 *
 * Each upload normally gets a folder of its own in Vercel Blob (`_objectKey`). When the file has
 * the same name as an existing entry, Payload 3.92 treats it as an overwrite instead: the browser
 * puts it straight under the collection's prefix, with no folder. On an update the entry would
 * keep its old `_objectKey`, so its URL points at a folder the new file isn't in and Blob answers
 * "not found". Clearing the key makes the URL match where the file went; an image's sizes are
 * made afterwards in the same folder, so they stay in step too.
 *
 * `req.file.clientUploadContext` is the receipt the server signed when it issued the upload, so
 * `allowOverwrite` can't be set from the browser. Remove this once Payload's overwrite check
 * accounts for `_objectKey` (storage-vercel-blob's authorizeFileOverwrite ignores it).
 */
export const keepOverwriteInFolder: CollectionBeforeOperationHook = ({ args, req }) => {
  const context = req.file?.clientUploadContext
  const overwrite =
    typeof context === 'object' && context !== null && 'allowOverwrite' in context && context.allowOverwrite === true
  if (!overwrite || !('data' in args) || typeof args.data !== 'object' || args.data === null) return args
  return { ...args, data: { ...args.data, _objectKey: null } }
}
