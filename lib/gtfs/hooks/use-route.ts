import useSWR, {Key} from 'swr'

import {noRevalidateConfig} from 'lib/config/swr'
import useUser from 'lib/hooks/use-user'

import getRoute from '../queries/get-route'

const hasNull = (a: unknown[]) => a.find((v) => v == null) == null

/**
 * Fetch a single route for a given feed group id, feed id, and route id.
 */
export default function useRoute(
  bundleId: string,
  feedId: string,
  routeId: string
): GTFS.Route {
  const {user} = useUser()
  const keyGroup = [bundleId, feedId, routeId, user]
  const key: Key = () => (hasNull(keyGroup) ? null : keyGroup)
  const response = useSWR<GTFS.Route, Error>(key, getRoute, noRevalidateConfig)
  return response.data
}
