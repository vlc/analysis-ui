import useSWR from 'swr'

import {API} from 'lib/constants'
import useUser from 'lib/hooks/use-user'
import {IUser} from 'lib/user'
import {createAuthHeaders} from 'lib/utils/auth-fetch'
import createGrid from 'lib/utils/create-grid'
import {safeFetch} from 'lib/utils/safe-fetch'
import s3Fetch from 'lib/utils/s3-fetch'

const parseJSON = (res: Response) => res.json()

/**
 * Post to the Java API to upload and process aggregation areas.
 */
export function createAggregationAreas(
  formData: FormData,
  regionId: string,
  user: IUser
) {
  const url = `${API.Region}/${regionId}/aggregationArea`
  const options = {
    method: 'POST',
    headers: createAuthHeaders(user),
    body: formData
  }
  return safeFetch<CL.AggregationArea[]>(url, parseJSON, options)
}

/**
 * Fetch the signed S3 URL from the API and the grid itself from S3 and returned the parsed grid.
 * @param aggregationArea
 * @param user
 * @returns CL.ParsedGrid
 */
export async function fetchAggregationAreaGrid(
  aggregationArea: CL.AggregationArea,
  user: IUser
): Promise<CL.ParsedGrid> {
  const url = `${API.Region}/${aggregationArea.regionId}/aggregationArea/${aggregationArea._id}`
  const res = await s3Fetch(url, user)
  if (res.ok === false) throw res.error
  return createGrid(res.data)
}

/**
 * Hook for getting a grid for an aggregation area.
 * @param aggregationArea
 * @returns
 */
export function useAggregationAreaGrid(
  aggregationArea?: CL.AggregationArea
): CL.ParsedGrid {
  const {user} = useUser()
  const {data} = useSWR(
    () => (aggregationArea == null ? null : [aggregationArea, user]),
    fetchAggregationAreaGrid
  )
  return data
}
