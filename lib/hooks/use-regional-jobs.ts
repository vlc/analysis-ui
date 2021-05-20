import useSWR from 'swr'

import {API} from 'lib/constants'
import {IUser} from 'lib/user'
import authFetch from 'lib/utils/auth-fetch'
import {ResponseError} from 'lib/utils/safe-fetch'

import useUser from './use-user'

const refreshInterval = 15_000

/**
 * SWR expects errors to throw.
 */
async function swrFetcher(regionId: string, user: IUser) {
  const response = await authFetch<CL.RegionalJob[]>(
    `${API.Region}/${regionId}/regional/running`,
    user
  )
  if (response.ok) return response.data
  throw response
}

const EMPTY_JOBS: CL.RegionalJob[] = []

export default function useRegionalJobs(regionId: string) {
  const {user} = useUser()
  // Request activity on a specific interval
  const response = useSWR<CL.RegionalJob[], ResponseError>(
    user ? [regionId, user] : null,
    swrFetcher,
    {refreshInterval}
  )

  return {
    data: response.data ?? EMPTY_JOBS
  }
}
