import gtfsFetch from '../gtfs-fetch'

export type StopsResponse = {
  stops: GTFS.Stop[]
}

const query = `
query stopsQuery($feedGroupId: String, $feedId: String) {
  stops (feedGroupId: $feedGroupId, feedId: $feedId) {
    stop_id,
    stop_name,
    stop_lat,
    stop_lon
  }
}`

export default async function getStops(
  feedGroupId: string,
  feedId: string,
  user: CL.User
) {
  const res = await gtfsFetch<StopsResponse>(query, {feedGroupId, feedId}, user)
  if (res.ok === false) throw res.error
  return res.data.stops
}
