import gtfsFetch from '../gtfs-fetch'

export type RouteResponse = {
  route: GTFS.Route
}

const query = `
query routeQuery($feedGroupId: String, $feedId: String, $routeId: String) {
  route (feedGroupId: $feedGroupId, feedId: $feedId, routeId: $routeId) {
    route_id
    route_short_name
    route_long_name
    patterns {
      name,
      pattern_id,
      geometry,
      trips {
        trip_id,
        trip_short_name,
        trip_headsign,
        start_time,
        direction_id,
        duration
      },
      stops {
        stop_id
      }
    }
  }
}`

export default async function getRoute(
  feedGroupId: string,
  feedId: string,
  routeId: string,
  user: CL.User
) {
  const res = await gtfsFetch<RouteResponse>(
    query,
    {feedGroupId, feedId, routeId},
    user
  )
  if (res.ok === false) throw res.error
  return res.data.route
}
