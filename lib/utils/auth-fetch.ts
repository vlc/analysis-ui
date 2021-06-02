import {parse} from 'cookie'

import {safeFetch, SafeResponse} from './safe-fetch'

export function createAuthHeaders(user?: CL.User) {
  const headers = {
    Authorization: `bearer ${user?.idToken}`
  }

  // Add the admin access group for administrators if it exists.
  if (user?.accessGroup === process.env.NEXT_PUBLIC_ADMIN_ACCESS_GROUP) {
    const adminTempAccessGroup = parse(document.cookie).adminTempAccessGroup
    if (adminTempAccessGroup?.length > 0) {
      headers['X-Conveyal-Access-Group'] = adminTempAccessGroup
    }
  }
  return headers
}

/**
 * Fetch wrapper that includes authentication. Defaults headers to JSON.
 */
export default function authFetch<T>(
  url: string,
  user: CL.User,
  parser: (res: Response) => Promise<T> = (res) => res.json(),
  options?: RequestInit
): Promise<SafeResponse<T>> {
  return safeFetch(url, parser, {
    mode: 'cors',
    ...options,
    headers: {
      ...createAuthHeaders(user),
      ...options?.headers
    }
  })
}
