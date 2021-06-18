import useSWR from 'swr'

import {API} from 'lib/constants'
import {UseDataResponse} from 'lib/hooks/use-data'
import useUser from 'lib/hooks/use-user'
import authFetch from 'lib/utils/auth-fetch'

import predictJobTimeRemaining from '../predict-job-time-remaining'

const refreshInterval = 15_000

// Show time if...at least one task is complete AND either the regional analysis
// was created more than five minutes ago or there is more than one acitve worker.
function getJobStatus(job: CL.RegionalJob): string {
  if (job.complete === job.total) return 'assembling results...'
  if (job.complete === 0) return 'starting cluster...'
  return predictJobTimeRemaining(job)
}

/**
 * SWR expects errors to throw.
 */
async function swrFetcher(
  url: string,
  user: CL.User
): Promise<CL.RegionalJob[]> {
  const response = await authFetch<CL.RegionalJob[]>(url, user)
  if (response.ok)
    return response.data.map((v) => ({...v, statusText: getJobStatus(v)}))
  throw response
}

export default function useRegionalJobs(
  regionId: string
): UseDataResponse<CL.RegionalJob[]> {
  const {user} = useUser()
  // Request activity on a specific interval
  const url = `${API.Region}/${regionId}/regional/running`
  const swrKey = () => (user ? [url, user] : null)
  const response = useSWR(swrKey, swrFetcher, {refreshInterval})

  return {
    data: response.data,
    error: response.error,
    url
  }
}
