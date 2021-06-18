import gtfsFetch from '../gtfs-fetch'

export type FeedRoutesResponse = {
  routes: GTFS.Route[]
}

const query = `
query routeQuery($feedGroupId: String, $feedId: String) {
  routes (feedGroupId: $feedGroupId, feedId: $feedId) {
    route_id
    route_short_name
    route_long_name
  }
}`

export default async function getFeedRoutes(
  feedGroupId: string,
  feedId: string,
  user: CL.User
) {
  const res = await gtfsFetch<FeedRoutesResponse>(
    query,
    {feedGroupId, feedId},
    user
  )
  if (res.ok === false) throw res.error
  return res.data.routes
}
