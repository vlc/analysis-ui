import {createUseCollection} from './use-collection'

const useCollection =
  createUseCollection<CL.RegionalAnalysis>('regional-analyses')

/**
 * Default way of querying regional analyses.
 */
export default function useRegionalAnalyses(regionId: string) {
  return useCollection({
    query: {
      deleted: false,
      regionId
    },
    options: {
      projection: {
        'request.scenario.modifications': 0
      },
      sort: {
        createdAt: 1
      }
    }
  })
}
