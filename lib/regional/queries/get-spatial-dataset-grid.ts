import {API} from 'lib/constants'
import createGrid from 'lib/utils/create-grid'
import signedS3Fetch from 'lib/utils/s3-fetch'

// Store fetched grids
const fetchedGrids: Record<string, CL.ParsedGrid> = {}

export default async function getSpatialDatasetGrid(id: string, user: CL.User) {
  // Check the local store first.
  if (fetchedGrids[id]) return fetchedGrids[id]

  // Fetch the grid from S3 using a signed parameter
  const url = `${API.Opportunities}/${id}`
  const res = await signedS3Fetch(url, user)
  if (res.ok === false) throw res.error
  const grid = createGrid(res.data)
  fetchedGrids[id] = grid
  return grid
}
