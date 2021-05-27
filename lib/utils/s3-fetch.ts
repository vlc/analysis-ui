import {IUser} from 'lib/user'

import authFetch from './auth-fetch'
import {fetchBuffer} from './safe-fetch'

type S3UrlResponse = {
  url: string
}

/**
 * Fetch a signed S3 URL and fetch the URL.
 */
export default async function signedS3Fetch(url: string, user: IUser) {
  const res = await authFetch<S3UrlResponse>(url, user)
  if (res.ok === false) return res
  return await fetchBuffer(res.data.url, {
    cache: 'force-cache',
    credentials: 'omit'
  })
}
