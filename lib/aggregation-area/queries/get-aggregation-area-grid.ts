import {API} from 'lib/constants'
import createGrid from 'lib/utils/create-grid'
import s3Fetch from 'lib/utils/s3-fetch'

/**
 * Fetch the signed S3 URL from the API and the grid itself from S3 and returned the parsed grid.
 * @param aggregationArea
 * @param user
 * @returns CL.ParsedGrid
 */
export default async function fetchAggregationAreaGrid(
  aggregationArea: CL.AggregationArea,
  user: CL.User
): Promise<CL.ParsedGrid> {
  const url = `${API.Region}/${aggregationArea.regionId}/aggregationArea/${aggregationArea._id}`
  const res = await s3Fetch(url, user)
  if (res.ok === false) throw res.error
  return createGrid(res.data)
}
