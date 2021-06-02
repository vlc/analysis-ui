import useSWR from 'swr'

import useUser from 'lib/hooks/use-user'

import getSpatialDatasetGrid from '../queries/get-spatial-dataset-grid'

export default function useSpatialDatasetGrid(id?: string) {
  const {user} = useUser()
  const {data} = useSWR(
    () => (id !== null && user != null ? [id, user] : null),
    getSpatialDatasetGrid
  )
  return data
}
