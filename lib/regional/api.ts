import {useCallback} from 'react'
import useSWR from 'swr'

import useUser from 'lib/hooks/use-user'
import {API} from 'lib/constants'
import authFetch, {authFetchText} from 'lib/utils/auth-fetch'
import createGrid from 'lib/utils/create-grid'
import downloadObjectAsJson from 'lib/utils/download-json'
import signedS3Fetch from 'lib/utils/s3-fetch'
import {IUser} from 'lib/user'

import {variantIsCompatible} from './utils'

// Grids that have been already fetched.
const fetchedGrids: CL.RegionalGrid[] = []

// Grids equal
const checkGridExists = (g: CL.RegionalGrid, v: CL.RegionalAnalysisVariant) =>
  g.analysisId === v.analysis._id &&
  g.cutoff === v.cutoff &&
  g.percentile === v.percentile &&
  g.pointSetId === v.pointSetId

// Construct a URL path from the variant
const variantToURL = (v: CL.RegionalAnalysisVariant) =>
  `${v.analysis._id}/grid/grid?cutoff=${v.cutoff}&percentile=${v.percentile}&destinationPointSetId=${v.pointSetId}`

/**
 * Hook for fetching a regional analysis grid
 */
export function useRegionalAnalysisGrid(
  variant: CL.RegionalAnalysisVariant
): CL.RegionalGrid {
  const {user} = useUser()
  const {data} = useSWR(
    () => (variantIsCompatible(variant) ? [variant, user] : null),
    fetchRegionalGrid
  )
  return data
}

/**
 *
 */
async function fetchRegionalGrid(
  variant: CL.RegionalAnalysisVariant,
  user: IUser
): Promise<CL.RegionalGrid> {
  // Check for a fetched grid
  const fetchedGrid = fetchedGrids.find((grid) =>
    checkGridExists(grid, variant)
  )
  if (fetchedGrid != null) return fetchedGrid

  // Fetch the grid from S3 using a signed parameter
  const res = await signedS3Fetch(
    `${API.Regional}/${variantToURL(variant)}`,
    user
  )

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

export function useDownloadCSVResults(analysisId: string) {
  const {user} = useUser()

  return useCallback(
    async (type: string) => {
      const url = `${API.Regional}/${analysisId}/csv/${type}`
      const res = await authFetchText(url, user)
      if (res.ok === false) throw res.error
      window.open(res.data)
    },
    [analysisId, user]
  )
}

export function useDownloadRequestJSON(analysis: CL.RegionalAnalysis) {
  const {user} = useUser()
  return useCallback(async () => {
    const url = `${API.Regional}/${analysis._id}`
    const res = await authFetch(url, user)
    if (res.ok === false) throw res.error
    downloadObjectAsJson({
      data: res.data,
      filename: analysis.name + '.json'
    })
  }, [analysis, user])
}

/**
 * Perform an authenticated fetch to get a presigned URL to download a grid
 * from S3, then download it. Pass in the path to fetch.
 */
export function useDownloadProjectGIS(
  analysisVariant: CL.RegionalAnalysisVariant
) {
  const {user} = useUser()
  const url = `${API.Regional}/${analysisVariant.analysis._id}/grid/tiff?cutoff=${analysisVariant.cutoff}&percentile=${analysisVariant.percentile}&destinationPointSetId=${analysisVariant.pointSetId}`

  return useCallback(async () => {
    const res = await authFetch<{url: string}>(url, user)
    if (res.ok === false) throw res.error
    window.open(res.data.url)
  }, [url, user])
}
