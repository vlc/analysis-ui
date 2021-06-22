import {API_URL} from 'lib/constants'
import authFetch from 'lib/utils/auth-fetch'

const toJSON = (response: Response) => response.json()

const fetchOptions: RequestInit = {
  cache: 'force-cache'
}

export default function gtfsFetch<T>(
  bundleId: string,
  feedId: string,
  path: string,
  user: CL.User
) {
  const url = `${API_URL}/gtfs/${bundleId}/${feedId}${path}`
  return authFetch<T>(url, user, toJSON, fetchOptions)
}
