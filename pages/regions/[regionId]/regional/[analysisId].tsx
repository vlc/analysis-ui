import InnerDock from 'lib/components/inner-dock'
import LoadingScreen from 'lib/components/loading-screen'
import useRegionalAnalyses from 'lib/hooks/use-regional-analyses'
import useRegionalJobs from 'lib/hooks/use-regional-jobs'
import MapLayout from 'lib/layouts/map'
import ActiveAnalysisPage from 'lib/regional/components/active-analysis-page'
import ResultsPage from 'lib/regional/components/results-page'
import {getValidComparisonAnalyses, useVariant} from 'lib/regional/utils'

const RegionalPage: CL.Page = ({query}) => {
  const {analysisId, regionId} = query
  const regionalAnalysisCollection = useRegionalAnalyses(regionId)
  const allAnalyses = regionalAnalysisCollection.data
  const activeAnalysis = allAnalyses.find((ra) => ra._id === analysisId)
  const {data: jobs} = useRegionalJobs(regionId)
  const activeJob = jobs.find((j) => j.jobId === analysisId)

  // Construct the parsed query objects
  const analysisVariant: CL.RegionalAnalysisVariant = useVariant(
    activeAnalysis,
    parseInt(query.cutoff, 10),
    parseInt(query.percentile, 10),
    query.pointSetId
  )

  // Get valid comparison analyses
  const comparisonAnalyses = activeAnalysis
    ? getValidComparisonAnalyses(allAnalyses, jobs, activeAnalysis)
    : []

  return (
    <InnerDock>
      {activeAnalysis ? (
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
        <LoadingScreen />
      )}
    </InnerDock>
  )
}

RegionalPage.Layout = MapLayout

export default RegionalPage
