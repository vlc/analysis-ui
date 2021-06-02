import {API} from 'lib/constants'
import authFetch from 'lib/utils/auth-fetch'

/**
 * Create a regional analysis
 */
export default function createRegionalAnalysis(
  options: Partial<CL.ProfileRequest>,
  user: CL.User
) {
  return authFetch<CL.RegionalAnalysis>(
    API.Regional,
    user,
    (res) => res.json(),
    {
      method: 'POST',
      body: JSON.stringify(options)
    }
  )
}
