import {compose} from 'lib/graphql/query'
import authFetch from 'lib/utils/auth-fetch'

const toJSON = (response: Response) => response.json()

const fetchOptions: RequestInit = {
  cache: 'force-cache'
}

export default function gtfsFetch<T>(
  query: string,
  variables: Record<string, string>,
  user: CL.User
) {
  return authFetch<T>(compose(query, variables), user, toJSON, fetchOptions)
}
