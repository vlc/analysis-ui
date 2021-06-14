import {createContext} from 'react'

import {LS_MOM} from 'lib/constants'
import {getParsedItem, stringifyAndSet} from 'lib/utils/local-storage'

export const getLocalState = (): Record<string, string[]> =>
  getParsedItem(LS_MOM) ?? {}
export function updateLocalState(
  projectId: string,
  ids: string[]
): Record<string, string[]> {
  const state = getLocalState()
  state[projectId] = ids
  stringifyAndSet(LS_MOM, state)
  return state
}

const ModificationsOnMapContext = createContext<{
  isOnMap: (projectId: string, id: string) => boolean
  state: Record<string, string[]>
  setAll: (projectId: string, ids: string[]) => void
  toggle: (projectId: string, id: string) => void
}>(null)

export default ModificationsOnMapContext
