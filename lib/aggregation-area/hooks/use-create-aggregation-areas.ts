import {useCallback} from 'react'

import useUser from 'lib/hooks/use-user'

import createAggregationAreas from '../mutations/create-aggregation-areas'

/**
 * Use create
 */
export default function useCreateAggregationAreas(regionId: string) {
  const {user} = useUser()
  return useCallback(
    (formData: FormData) => createAggregationAreas(formData, regionId, user),
    [regionId, user]
  )
}
