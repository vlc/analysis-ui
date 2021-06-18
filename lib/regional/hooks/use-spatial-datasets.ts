import {useSpatialDatasets} from 'lib/hooks/use-collection'

export default function useSpatialDatasetsInRegion(regionId: string) {
  const {data} = useSpatialDatasets({
    query: {regionId},
    options: {
      projection: {
        name: 1,
        sourceName: 1
      }
    }
  })
  return data
}
