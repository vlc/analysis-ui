import {useCallback} from 'react'

import useUser from 'lib/hooks/use-user'

import createRegionalAnalysis from '../mutations/create-regional-analysis'

/**
 * Hook to create a regional analysis.
 */
export default function useCreateRegionalAnalysis() {
  const {user} = useUser()
  return useCallback(
    async (options: Partial<CL.ProfileRequest>) => {
      const res = await createRegionalAnalysis(options, user)
      if (res.ok === false) throw res.error
      return res.data
    },
    [user]
  )
}
