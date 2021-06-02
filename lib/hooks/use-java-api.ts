import {useCallback} from 'react'

import {API_URL} from 'lib/constants'
import authFetch from 'lib/utils/auth-fetch'

import useUser from './use-user'

const parseJSON = (res: Response) => res.json()

/**
 * Hook that generates a helper for fetching from the Java API.
 */
export default function useJavaAPI<T>(parser = parseJSON) {
  const {user} = useUser()
  return useCallback(
    (url: string, options?: RequestInit) => {
      return authFetch<T>(`${API_URL}/${url}`, user, parser, options)
    },
    [parser, user]
  )
}
