import useSWR, {Key} from 'swr'

import {noRevalidateConfig} from 'lib/config/swr'
import useUser from 'lib/hooks/use-user'

import getRoutePatterns from '../queries/get-route-patterns'

const hasNull = (a: unknown[]) => a.find((v) => v == null) == null

/**
 * Fetch a single route for a given feed group id, feed id, and route id.
 */
export default function useRoutePatterns(
  bundleId: string,
  feedId: string,
  routeId: string
): GTFS.Pattern[] {
  const {user} = useUser()
  const keyGroup = [bundleId, feedId, routeId, user]
  const key: Key = () => (hasNull(keyGroup) ? null : keyGroup)
  const response = useSWR<GTFS.Pattern[], Error>(
    key,
    getRoutePatterns,
    noRevalidateConfig
  )
  return response.data ?? []
}
