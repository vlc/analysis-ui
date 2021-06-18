import useSWR from 'swr'

import useUser from 'lib/hooks/use-user'

import getAggregationAreaGrid from '../queries/get-aggregation-area-grid'

/**
 * Hook for getting a grid for an aggregation area.
 * @param aggregationArea
 * @returns
 */
export default function useAggregationAreaGrid(
  aggregationArea?: CL.AggregationArea
): CL.ParsedGrid {
  const {user} = useUser()
  const {data} = useSWR(
    () => (aggregationArea == null ? null : [aggregationArea, user]),
    getAggregationAreaGrid
  )
  return data
}
