import {API} from 'lib/constants'
import createGrid from 'lib/utils/create-grid'
import signedS3Fetch from 'lib/utils/s3-fetch'

// Grids that have been already fetched.
const fetchedGrids: CL.RegionalGrid[] = []

// Check if a grid matches a given variant
const checkGridMatchesVariant = (
  g: CL.RegionalGrid,
  v: CL.RegionalAnalysisVariant
) =>
  g.analysisId === v.analysis._id &&
  g.cutoff === v.cutoff &&
  g.percentile === v.percentile &&
  g.pointSetId === v.pointSetId

// Construct a URL path from the variant
const variantToURL = (v: CL.RegionalAnalysisVariant) =>
  `${v.analysis._id}/grid/grid?cutoff=${v.cutoff}&percentile=${v.percentile}&destinationPointSetId=${v.pointSetId}`

/**
 *
 */
export default async function getRegionalGrid(
  variant: CL.RegionalAnalysisVariant,
  user: CL.User
): Promise<CL.RegionalGrid> {
  // Check for a fetched grid
  const fetchedGrid = fetchedGrids.find((grid) =>
    checkGridMatchesVariant(grid, variant)
  )
  if (fetchedGrid != null) return fetchedGrid

  // Fetch the grid from S3 using a signed parameter
  const url = `${API.Regional}/${variantToURL(variant)}`
  const res = await signedS3Fetch(url, user)

  // Throw for usage with SWR
  if (res.ok === false) throw res.error

  // Construct a regional grid from the given query, store, and return
  const newGrid: CL.RegionalGrid = {
    ...createGrid(res.data),
    ...variant,
    analysisId: variant.analysis._id
  }
  fetchedGrids.push(newGrid)
  return newGrid
}
