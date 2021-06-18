import {useDisclosure} from '@chakra-ui/react'
import get from 'lodash/get'
import {memo} from 'react'
import {CircleMarker, Tooltip} from 'react-leaflet'

import useRouteStops from 'lib/gtfs/hooks/use-route-stops'

import Pane from '../map/pane'

const STOP_RADIUS = 4

export default function StopLayer({
  feedGroupId,
  modification,
  nullIsWildcard = false,
  onSelect,
  selectedColor,
  unselectedColor
}: {
  feedGroupId: string
  modification: CL.StopModification
  nullIsWildcard?: boolean
  onSelect?: (stop: GTFS.Stop) => void
  selectedColor?: string
  unselectedColor?: string
}) {
  const routeStops = useRouteStops(
    feedGroupId,
    modification.feed,
    get(modification, 'routes[0]')
  )
  /* const routeStops = useMemo(
    () => getUniqueStops(p.feed, p.modification),
    [p.feed, p.modification]
  ) */

  const showUnselected = !!unselectedColor

  const isSelected = (s) =>
    modification.stops == null
      ? nullIsWildcard
      : modification.stops.includes(s.stop_id)

  return (
    <Pane zIndex={503}>
      {showUnselected &&
        routeStops
          .filter((s) => !isSelected(s))
          .map((s) => (
            <StopMarker
              color={unselectedColor}
              key={s.stop_id}
              onSelect={onSelect}
              stop={s}
            />
          ))}
      {routeStops.filter(isSelected).map((s) => (
        <StopMarker
          color={selectedColor}
          key={s.stop_id}
          onSelect={onSelect}
          stop={s}
        />
      ))}
    </Pane>
  )
}

const StopMarker = memo<{
  color: string
  onSelect: (stop: GTFS.Stop) => void
  stop: GTFS.Stop
}>(({color, onSelect, stop}) => {
  const tooltip = useDisclosure()
  const center: L.LatLngExpression = [stop.stop_lat, stop.stop_lon]
  return (
    <CircleMarker
      center={center}
      color={color}
      onClick={() => onSelect && onSelect(stop)}
      onMouseover={tooltip.onOpen}
      onMouseout={tooltip.onClose}
      radius={STOP_RADIUS}
    >
      <Tooltip
        key={stop.stop_id + tooltip.isOpen}
        opacity={tooltip.isOpen ? 1 : 0}
        permanent
      >
        <span data-id={stop.stop_id} data-coordinate={center.join(',')}>
          {stop.stop_name}
        </span>
      </Tooltip>
    </CircleMarker>
  )
})

function getUniqueStops(feed, modification) {
  if (!feed || modification.routes == null) return []
  const route = feed.routes.find((r) => r.route_id === modification.routes[0])
  if (!route || !route.patterns) return []
  let patterns = route.patterns

  if (modification.trips !== null) {
    patterns = patterns.filter((p) =>
      p.trips.find((t) => modification.trips.includes(t.trip_id))
    )
  }

  return getUniqueStopsForPatterns({
    patterns,
    stopsById: feed.stopsById
  })
}

function getUniqueStopsForPatterns({patterns, stopsById}) {
  const routeStopIds = new Set<string>()
  patterns.forEach((p) => {
    p.stops.forEach((s) => routeStopIds.add(s.stop_id))
  })
  const stops = []
  routeStopIds.forEach((sid) => stops.push(stopsById[sid]))
  return stops
}
