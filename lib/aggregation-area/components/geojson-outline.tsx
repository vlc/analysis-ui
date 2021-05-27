import {useMemo} from 'react'

import KeyedGeoJSON from 'lib/components/map/geojson'

import {useAggregationAreaGrid} from '../api'
import computeOutline from '../convert-to-geojson'

/**
 * Fetch the aggregation area's grid and convert to GeoJSON.
 */
export default function AggregationAreaGeoJSONOutline({
  aggregationArea
}: {
  aggregationArea: CL.AggregationArea
}) {
  const grid = useAggregationAreaGrid(aggregationArea)
  const geojson = useMemo(() => (grid != null ? computeOutline(grid) : null), [
    grid
  ])
  return <KeyedGeoJSON data={geojson} />
}
