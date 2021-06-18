import get from 'lodash/get'
import dynamic from 'next/dynamic'
import {memo} from 'react'
import {useSelector} from 'react-redux'

import {activeOpportunityDatasetGrid} from '../selectors'

import createDrawTile from '../create-draw-tile'

const Gridualizer = dynamic(() => import('lib/components/map/gridualizer'), {
  ssr: false
})

/**
 * Container for drawing opportunity data on the map.
 */
let key = 0
export default memo(function Dotmap() {
  const grid = useSelector(activeOpportunityDatasetGrid)
  if (get(grid, 'data.length', 0) > 0) {
    return (
      <Gridualizer key={key++} drawTile={createDrawTile(grid)} zIndex={299} />
    )
  }
  return null
})
