import uniq from 'lodash/uniq'
import {useMemo} from 'react'

import useRoutePatterns from './use-route-patterns'
import useFeedStops from './use-feed-stops'

/**
 * Get all of the unique stops for a given route via it's patterns and trips.
 */
export default function useRouteStops(
  bundleId: string,
  feedId: string,
  routeId: string
) {
  const patterns = useRoutePatterns(bundleId, feedId, routeId)
  const stops = useFeedStops(bundleId, feedId)
  return useMemo(() => {
    const uniqueIds = uniq(patterns.flatMap((p) => p.orderedStopIds))
    return uniqueIds.map((id) => stops.find((s) => s.id === id))
  }, [patterns, stops])
}
