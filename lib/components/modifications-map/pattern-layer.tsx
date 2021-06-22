import {color as parseColor} from 'd3-color'
import get from 'lodash/get'

import colors from 'lib/constants/colors'
import {useRoutePatterns} from 'lib/gtfs/hooks'
import {getPatternsForModification} from 'lib/utils/patterns'

import DirectionalMarkers from '../directional-markers'
import PatternGeometry from '../map/geojson-patterns'

/**
 * Display patterns on the map
 */
export default function PatternLayer({
  activeTrips = null,
  color = colors.NEUTRAL,
  dim = false,
  bundleId,
  modification
}: {
  activeTrips?: string[]
  color?: string
  dim?: boolean
  bundleId: string
  modification: CL.FeedModification
}) {
  const patterns = useRoutePatterns(
    bundleId,
    modification.feed,
    get(modification, 'routes[0]')
  )

  /** TODO Filter patterns 
  const [patterns, setPatterns] = useState(() =>
    getPatternsForModification({
      activeTrips,
      dim,
      feed,
      modification
    })
  )

  useEffect(() => {
    setPatterns(
      getPatternsForModification({
        activeTrips,
        dim,
        feed,
        modification
      })
    )
  }, [activeTrips, dim, feed, modification])
  */

  const parsedColor = parseColor(color)
  if (dim) parsedColor.opacity = 0.2

  if (patterns?.length > 0) {
    return (
      <>
        <PatternGeometry color={parsedColor + ''} patterns={patterns} />
        <DirectionalMarkers color={parsedColor + ''} patterns={patterns} />
      </>
    )
  } else {
    return null
  }
}
