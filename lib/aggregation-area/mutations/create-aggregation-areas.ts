import {API} from 'lib/constants'
import authFetch from 'lib/utils/auth-fetch'

const parseJSON = (res: Response) => res.json()

/**
 * Post to the Java API to upload and process aggregation areas.
 */
export default function createAggregationAreas(
  formData: FormData,
  regionId: string,
  user: CL.User
) {
  const url = `${API.Region}/${regionId}/aggregationArea`
  const options = {
    method: 'POST',
    body: formData
  }
  return authFetch<CL.AggregationArea[]>(url, user, parseJSON, options)
}
