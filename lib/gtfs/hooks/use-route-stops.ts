import useRoute from './use-route'
import useStops from './use-stops'

export default function useRouteStops(
  feedGroupId: string,
  feedId: string,
  routeId: string
) {
  const route = useRoute(feedGroupId, feedId, routeId)
  const stops = useStops(feedGroupId, feedId)
  return route.stops?.map(({stop_id}) =>
    stops.find((s) => s.stop_id === stop_id)
  )
}
