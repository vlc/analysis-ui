import {useMemo} from 'react'

import getAggregateAccessibility from '../aggregate-accessibility'

import useAggregationAreaGrid from './use-aggregation-area-grid'

export default function useAggregateAccessibility(
  accessibility: CL.RegionalGrid,
  aggregationArea: CL.AggregationArea,
  weights: CL.ParsedGrid
): CL.AggregateAccessibility {
  const aggregationAreaGrid = useAggregationAreaGrid(aggregationArea)
  return useMemo(
    () =>
      accessibility != null && aggregationAreaGrid != null && weights != null
        ? getAggregateAccessibility(accessibility, aggregationAreaGrid, weights)
        : null,
    [accessibility, aggregationAreaGrid, weights]
  )
}
