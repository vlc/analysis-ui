import {Session} from '@auth0/nextjs-auth0'
import {parse} from 'cookie'
import {IncomingMessage} from 'http'

import {AUTH_DISABLED} from 'lib/constants'

import LogRocket from './logrocket'

// Tell TypeScript that we attach the user to the window object
declare global {
  interface Window {
    __user?: CL.User
    zE: any
  }
}

// When auth is disabled, use a local user
export const localUser: CL.User = {
  accessGroup: 'local',
  adminTempAccessGroup: null,
  email: 'local',
  idToken: 'idToken'
}

// Get a CL.User from a Session
export function userFromSession(
  req: IncomingMessage,
  session: Session
): CL.User {
  const user: CL.User = {
    ...session.user,
    // This is a namespace for a custom claim. Not a URL: https://auth0.com/docs/tokens/guides/create-namespaced-custom-claims
    accessGroup: session.user['http://conveyal/accessGroup'],
    adminTempAccessGroup: null,
    email: session.user.name,
    idToken: session.idToken
  }

  if (user.accessGroup === process.env.NEXT_PUBLIC_ADMIN_ACCESS_GROUP) {
    const adminTempAccessGroup = parse(req.headers.cookie || '')
      .adminTempAccessGroup
    if (adminTempAccessGroup) user.adminTempAccessGroup = adminTempAccessGroup
  }

  return user
}

// Helper functions to hide storage details
// Store on `window` so that each new tab/window needs to check the session
export function getUser(serverSideUser?: CL.User): undefined | CL.User {
  if (AUTH_DISABLED) return localUser
  if (!process.browser) return serverSideUser
  return window.__user || serverSideUser
}

export function storeUser(user: CL.User): void {
  if (!process.browser || AUTH_DISABLED) return

  // Add the adminTempAccessGroup for admins
  if (user.accessGroup === process.env.NEXT_PUBLIC_ADMIN_ACCESS_GROUP) {
    const adminTempAccessGroup = parse(document.cookie || '')
      .adminTempAccessGroup
    if (adminTempAccessGroup) user.adminTempAccessGroup = adminTempAccessGroup
  }

  // Store the user on window, requiring a new session on each tab/page
  window.__user = user

  // Identify the user for LogRocket
  LogRocket.identify(user.email, {
    accessGroup: user.accessGroup,
    email: user.email
  })

  // Identify the user for ZenDesk
  if (window.zE) {
    window.zE(() => {
      window.zE.identify({
        name: user.email,
        email: user.email,
        organization: user.accessGroup
      })
    })
  }
}

export function getIdToken(): string | void {
  return getUser()?.idToken
}
