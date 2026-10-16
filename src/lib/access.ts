/**
 * Access for the content the public site shows: anyone can read it, through the API and the
 * media file URLs as well as the pages.
 *
 * payload-totp (src/payload.config.ts) wraps every access function so that only a session that
 * has entered its authenticator code gets through. That would refuse visitors too, since they
 * have no session at all, so `custom.totp` leaves `read` out of the wrapper. Creating, editing
 * and deleting stay behind it. Spread this into any collection or global the site displays.
 */
export const publicRead = {
  access: { read: () => true },
  custom: { totp: { disableAccessWrapper: { read: true } } },
}
