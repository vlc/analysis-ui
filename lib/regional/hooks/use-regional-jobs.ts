import useSWR from 'swr'

import {API} from 'lib/constants'
import useUser from 'lib/hooks/use-user'
import authFetch from 'lib/utils/auth-fetch'
import {ResponseError} from 'lib/utils/safe-fetch'

import predictJobTimeRemaining from '../predict-job-time-remaining'

const refreshInterval = 15_000

// Show time if...at least one task is complete AND either the regional analysis
// was created more than five minutes ago or there is more than one acitve worker.
function getJobStatus(job) {
  if (job.complete === job.total) return 'assembling results...'
  if (job.complete === 0) return 'starting cluster...'
  return predictJobTimeRemaining(job)
}

/**
 * SWR expects errors to throw.
 */
async function swrFetcher(regionId: string, user: CL.User) {
  const url = `${API.Region}/${regionId}/regional/running`
  const response = await authFetch<CL.RegionalJob[]>(url, user)
  if (response.ok) return response.data
  throw response
}

export default function useRegionalJobs(regionId: string): CL.RegionalJob[] {
  const {user} = useUser()
  // Request activity on a specific interval
  const response = useSWR<CL.RegionalJob[], ResponseError>(
    () => (user ? [regionId, user] : null),
    swrFetcher,
    {refreshInterval}
  )

  return response.data?.map((v) => ({...v, statusText: getJobStatus(v)}))
}
