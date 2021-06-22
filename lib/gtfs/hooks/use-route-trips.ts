import useSWR, {Key} from 'swr'

import {noRevalidateConfig} from 'lib/config/swr'
import useUser from 'lib/hooks/use-user'

import getRouteTrips from '../queries/get-route-trips'

const hasNull = (a: unknown[]) => a.find((v) => v == null) == null

/**
 * Fetch a single route for a given feed group id, feed id, and route id.
 */
export default function useRouteTrips(
  bundleId: string,
  feedId: string,
  routeId: string
): GTFS.Trip[] {
  const {user} = useUser()
  const keyGroup = [bundleId, feedId, routeId, user]
  const key: Key = () => (hasNull(keyGroup) ? null : keyGroup)
  const response = useSWR<GTFS.Trip[], Error>(
    key,
    getRouteTrips,
    noRevalidateConfig
  )
  return response.data ?? []
}
