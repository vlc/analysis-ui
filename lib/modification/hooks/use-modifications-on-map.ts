import {useContext} from 'react'

import Context from '../modifications-on-map-context'

export default function useModificationsOnMap() {
  return useContext(Context)
}
