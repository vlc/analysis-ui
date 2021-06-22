import {useMemo} from 'react'

import {useRoutePatterns} from 'lib/gtfs/hooks'
import intersects from 'lib/utils/arrays-intersect'

export default function useFilteredPatterns(
  bundleId: string,
  feedId: string,
  routeId: string,
  trips?: string[]
) {
  const patterns = useRoutePatterns(bundleId, feedId, routeId)
  return useMemo(() => {
    if (trips?.length > 0) {
      return patterns.filter((p) => intersects(p.associatedTripIds, trips))
    } else {
      return patterns
    }
  }, [patterns, trips])
}
