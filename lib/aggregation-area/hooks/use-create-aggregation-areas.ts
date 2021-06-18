import {useCallback} from 'react'

import {useCurrentRegionId} from 'lib/hooks/use-current-region'
import useUser from 'lib/hooks/use-user'

import createAggregationAreas from '../mutations/create-aggregation-areas'

/**
 * Use create
 */
export default function useCreateAggregationAreas() {
  const regionId = useCurrentRegionId()
  const {user} = useUser()
  return useCallback(
    (formData: FormData) => createAggregationAreas(formData, regionId, user),
    [regionId, user]
  )
}
