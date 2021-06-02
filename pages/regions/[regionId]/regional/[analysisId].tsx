import {useEffect} from 'react'

import FullSpinner from 'lib/components/full-spinner'
import InnerDock from 'lib/components/inner-dock'
import useRegionalAnalyses from 'lib/hooks/use-regional-analyses'
import {useShallowRouteTo} from 'lib/hooks/use-route-to'
import MapLayout from 'lib/layouts/map'
import ActiveAnalysisPage from 'lib/regional/components/active-analysis-page'
import ResultsPage from 'lib/regional/components/results-page'
import useRegionalJobs from 'lib/regional/hooks/use-regional-jobs'
import {
  getDefaultVariants,
  getValidComparisonAnalyses,
  useVariant,
  variantIsCompatible
} from 'lib/regional/utils'

const RegionalPage: CL.Page = ({query}) => {
  const {analysisId, regionId} = query
  const regionalAnalysisCollection = useRegionalAnalyses(regionId)
  const allAnalyses = regionalAnalysisCollection.data
  const activeAnalysis = allAnalyses.find((ra) => ra._id === analysisId)
  const jobs = useRegionalJobs(regionId)
  const activeJob = (jobs ?? []).find((j) => j.jobId === analysisId)
  const routeTo = useShallowRouteTo('regionalAnalysis')

  // Construct the parsed query objects
  const analysisVariant: CL.RegionalAnalysisVariant = useVariant(
    activeAnalysis,
    parseInt(query.cutoff, 10),
    parseInt(query.percentile, 10),
    query.pointSetId
  )

  // Redirect to a valid variant if one has not been selected.
  useEffect(() => {
    if (
      analysisVariant.analysis != null &&
      !variantIsCompatible(analysisVariant)
    ) {
      routeTo(getDefaultVariants(analysisVariant.analysis))
    }
  }, [analysisVariant, routeTo])

  // Get valid comparison analyses
  const comparisonAnalyses =
    activeAnalysis && Array.isArray(jobs)
      ? getValidComparisonAnalyses(allAnalyses, jobs, activeAnalysis)
      : []

  return (
    <InnerDock>
      {activeAnalysis && Array.isArray(jobs) ? (
        activeJob ? (
          <ActiveAnalysisPage
            activeJob={activeJob}
            analysisVariant={analysisVariant}
            regionalAnalysisCollection={regionalAnalysisCollection}
          />
        ) : (
          <ResultsPage
            analysisVariant={analysisVariant}
            comparisonAnalyses={comparisonAnalyses}
            query={query}
            regionalAnalysisCollection={regionalAnalysisCollection}
          />
        )
      ) : (
        <FullSpinner />
      )}
    </InnerDock>
  )
}

RegionalPage.Layout = MapLayout

export default RegionalPage
