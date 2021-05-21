import {API} from 'lib/constants'
import {IUser} from 'lib/user'
import {createAuthHeaders} from 'lib/utils/auth-fetch'
import {safeFetch} from 'lib/utils/safe-fetch'

export function createAggregationAreas(
  formData: FormData,
  regionId: string,
  user: IUser
) {
  return safeFetch<CL.AggregationArea[]>(
    `${API.Region}/${regionId}/aggregationArea`,
    (res) => res.json(),
    {
      method: 'POST',
      headers: createAuthHeaders(user),
      body: formData
    }
  )
}
