import {FilterQuery, FindOneOptions} from 'mongodb'
import {useMemo} from 'react'

import LogRocket from 'lib/logrocket'

/**
 * Construct a URL to use for querying from our MongoDB.
 */
export default function useQueryURL<T>(
  baseURL: string,
  query?: FilterQuery<T>,
  options?: FindOneOptions<T>
): string {
  return useMemo(() => {
    const parts = [baseURL]
    const queryParams = configToQueryParams(query, options)
    if (queryParams) parts.push(queryParams)
    return parts.join('?')
  }, [baseURL, query, options])
}

/**
 * Convert objects to URL encoded query parameters
 */
function configToQueryParams<T>(
  query?: FilterQuery<T>,
  options?: FindOneOptions<T>
): string {
  const params = []
  if (query) params.push(`query=${encode(query)}`)
  if (options) params.push(`options=${encode(options)}`)
  return params.join('&')
}

function encode(o: unknown) {
  if (o) {
    try {
      return encodeURIComponent(JSON.stringify(o) || '')
    } catch (e) {
      LogRocket.captureException(e)
      return ''
    }
  }
}
