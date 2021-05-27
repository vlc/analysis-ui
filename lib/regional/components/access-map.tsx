import {useMemo} from 'react'

import Gridualizer from 'lib/components/map/gridualizer'
import createDrawTile from 'lib/utils/create-draw-tile'

let key = 0
const nextKey = () => key++

/**
 * A map layer showing a Regional comparison
 */
export default function AccessMap({
  displayScale,
  grid
}: {
  displayScale: CL.RegionalDisplayScale
  grid: CL.RegionalGrid
}) {
  const drawTile = useMemo(() => {
    if (
      !grid ||
      !displayScale ||
      !displayScale.colorizer ||
      displayScale.error !== false
    )
      return null
    return {
      drawTile: createDrawTile({colorizer: displayScale.colorizer, grid}),
      key: nextKey()
    }
  }, [displayScale, grid])
  if (drawTile == null) return null
  // Remount every time there is a change to drawTile
  return (
    <Gridualizer key={drawTile.key} drawTile={drawTile.drawTile} zIndex={300} />
  )
}
