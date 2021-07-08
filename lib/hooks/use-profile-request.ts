import {useCallback} from 'react'
import createPersistedState from 'use-persisted-state'

import {PROFILE_REQUEST_DEFAULTS} from 'lib/constants'

import {useCurrentRegionId} from './use-current-region'

const usePersistedState = createPersistedState('profileRequestsSettings')

const initialState = [PROFILE_REQUEST_DEFAULTS, PROFILE_REQUEST_DEFAULTS]

/**
 * For the current region, get the request setting for the given index. Extracts it from
 * local storage by default.
 */
export default function useProfileRequest(index: number) {
  const regionId = useCurrentRegionId()
  const [state, setState] = usePersistedState<{
    [regionId: string]: CL.ProfileRequest[]
  }>({})

  const settings = state[regionId] ?? initialState

  const update = useCallback(
    (updates: Partial<CL.ProfileRequest>) => {
      setState((state) => {
        const regionSettings = [...(state[regionId] ?? initialState)]
        regionSettings[index] = {
          ...regionSettings[index],
          ...updates
        }
        return {
          ...state,
          [regionId]: regionSettings
        }
      })
    },
    [index, regionId, setState]
  )

  return [settings[index], update]
}
