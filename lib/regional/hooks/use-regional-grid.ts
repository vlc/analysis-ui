import useSWR from 'swr'

import useUser from 'lib/hooks/use-user'

import getRegionalGrid from '../queries/get-regional-grid'
import {variantIsCompatible} from '../utils'
/**
 * Hook for fetching a regional analysis grid
 */
export default function useRegionalAnalysisGrid(
  variant: CL.RegionalAnalysisVariant
): CL.RegionalGrid {
  const {user} = useUser()
  const {data} = useSWR(
    () => (variantIsCompatible(variant) ? [variant, user] : null),
    getRegionalGrid
  )
  return data
}
