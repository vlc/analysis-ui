import {IUser} from 'lib/user'
import {createAuthHeaders} from 'lib/utils/auth-fetch'
import safeFetch from 'lib/utils/safe-fetch'

export default function createAggregationAreas(
  formData: FormData,
  user: IUser
) {
  return safeFetch()
}
