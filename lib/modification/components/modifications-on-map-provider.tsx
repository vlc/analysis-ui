import {useCallback, useMemo, useState} from 'react'

import Context, {
  getLocalState,
  updateLocalState
} from '../modifications-on-map-context'

export default function ModificationsOnMapProvider({children}) {
  const [state, setState] = useState(() => getLocalState())

  const isOnMap = useCallback(
    (projectId: string, id: string) => {
      return state[projectId] && state[projectId].includes(id)
    },
    [state]
  )

  const setAll = useCallback(
    (projectId: string, ids: string[]) => {
      setState(updateLocalState(projectId, ids))
    },
    [setState]
  )

  const toggle = useCallback(
    (projectId: string, toggleId: string) => {
      const ids = state[projectId] ?? []
      const newIds = ids.includes(toggleId)
        ? ids.filter((id) => id !== toggleId)
        : [...ids, toggleId]
      setState(updateLocalState(projectId, newIds))
    },
    [state, setState]
  )

  const value = useMemo(
    () => ({isOnMap, state, setAll, toggle}),
    [isOnMap, state, setAll, toggle]
  )

  return <Context.Provider value={value}>{children}</Context.Provider>
}
