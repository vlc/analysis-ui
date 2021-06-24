import {useRouter} from 'next/router'
import {useEffect} from 'react'

import {ActivityContext, useActivitySync} from 'lib/hooks/use-activity'

/**
 * The Activity Provider wraps the entire application so that any component can call the `useActivity` hook to
 * get the latest activity information. The activity API is requested on each page load and re-requested at a set
 * interval. Therefore this provides an entry point to handle Unauthorized or Forbidden responses from the
 * API and to automatically log out the user, requiring them to log in again.
 */
export default function ActivityProvider({children}) {
  const res = useActivitySync()
  const router = useRouter()

  // Redirect if there is a 401 or 403 response to an activity request
  const {error} = res.response
  useEffect(() => {
    if (
      error &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      router.push('/api/auth/logout')
    }
  }, [error, router])

  return (
    <ActivityContext.Provider value={res}>{children}</ActivityContext.Provider>
  )
}
