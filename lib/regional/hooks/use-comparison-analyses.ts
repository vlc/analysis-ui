import {useMemo} from 'react'

import useRegionalAnalyses from 'lib/hooks/use-regional-analyses'

import {getValidComparisonAnalyses} from '../utils'

export default function useComparisonAnalyses(
  analysis: CL.RegionalAnalysis,
  jobs: CL.RegionalJob[]
) {
  const {data: allAnalyses} = useRegionalAnalyses(analysis.regionId)

  return useMemo(() => {
    return getValidComparisonAnalyses(allAnalyses ?? [], jobs ?? [], analysis)
  }, [allAnalyses, analysis, jobs])
}
