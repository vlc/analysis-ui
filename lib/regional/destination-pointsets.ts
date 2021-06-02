import {useSpatialDatasets} from 'lib/hooks/use-collection'

/**
 * Get the name and sourceName for the spatial datasets for this analysis.
 */
export function useDestinationPointSets(analysis: CL.RegionalAnalysis) {
  const {data} = useSpatialDatasets({
    query: {
      _id: {$in: analysis.destinationPointSetIds}
    },
    options: {
      projection: {
        name: 1,
        sourceName: 1
      }
    }
  })
  return data
}
