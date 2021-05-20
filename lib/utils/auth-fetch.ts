import {IUser} from '../user'

import {fetchData, fetchText, SafeResponse} from './safe-fetch'

export function createAuthHeaders(user?: IUser) {
  const headers = {
    Authorization: `bearer ${user?.idToken}`
  }
  if (user?.adminTempAccessGroup)
    headers['X-Conveyal-Access-Group'] = user.adminTempAccessGroup
  return headers
}

/**
 * Fetch wrapper that includes authentication. Defaults headers to JSON.
 */
export default function authFetch<T>(
  url: string,
  user?: IUser,
  options?: RequestInit
): Promise<SafeResponse<T>> {
  return fetchData(url, {
    mode: 'cors',
    ...options,
    headers: {
      ...createAuthHeaders(user),
      ...options?.headers
    }
  })
}

export function authFetchText(
  url: string,
  user?: IUser,
  options?: RequestInit
): Promise<SafeResponse<string>> {
  return fetchText(url, {
    mode: 'cors',
    ...options,
    headers: {
      ...createAuthHeaders(user),
      ...options?.headers
    }
  })
}
