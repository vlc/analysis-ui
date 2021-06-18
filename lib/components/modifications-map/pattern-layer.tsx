import {color as parseColor} from 'd3-color'
import get from 'lodash/get'

import colors from 'lib/constants/colors'
import useRoute from 'lib/gtfs/hooks/use-route'
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
  feedGroupId,
  modification
}: {
  activeTrips?: unknown[]
  color?: string
  dim?: boolean
  feedGroupId: string
  modification: CL.FeedModification
}) {
  const route = useRoute(
    feedGroupId,
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

  if (route?.patterns?.length > 0) {
    return (
      <>
        <PatternGeometry color={parsedColor + ''} patterns={route.patterns} />
        <DirectionalMarkers
          color={parsedColor + ''}
          patterns={route.patterns}
        />
      </>
    )
  } else {
    return null
  }
}
