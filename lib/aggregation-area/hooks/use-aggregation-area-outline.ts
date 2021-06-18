import {useMemo} from 'react'

import computeOutline from '../convert-to-geojson'

import useAggregationAreaGrid from './use-aggregation-area-grid'

export default function useAggregationAreaOutline(
  aggregationArea: CL.AggregationArea
) {
  const grid = useAggregationAreaGrid(aggregationArea)
  const geojson = useMemo(
    () => (grid != null ? computeOutline(grid) : null),
    [grid]
  )
  return geojson
}
