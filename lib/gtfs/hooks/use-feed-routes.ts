import useSWR, {Key} from 'swr'

import {noRevalidateConfig} from 'lib/config/swr'
import useUser from 'lib/hooks/use-user'

import getFeedRoutes from '../queries/get-feed-routes'

const hasNull = (a: unknown[]) => a.find((v) => v == null) == null

/**
 * Fetch a single route for a given feed group id, feed id, and route id.
 */
export default function useFeedRoutes(
  bundleId: string,
  feedId: string
): GTFS.Route[] {
  const {user} = useUser()
  const keyGroup = [bundleId, feedId, user]
  const key: Key = () => (hasNull(keyGroup) ? null : keyGroup)
  const response = useSWR<GTFS.Route[], Error>(
    key,
    getFeedRoutes,
    noRevalidateConfig
  )
  return response.data ?? []
}
