import InnerDock from 'lib/components/inner-dock'
import MapLayout from 'lib/layouts/map'
import useRegionalAnalyses from 'lib/hooks/use-regional-analyses'
import useRegionalJobs from 'lib/hooks/use-regional-jobs'
import ResultsPage from 'lib/regional/results-page'
import SelectPage from 'lib/regional/select-page'

export default function RegionalPage({query}: {query: CL.Query}) {
  const {analysisId, regionId} = query
  const regionalAnalysisCollection = useRegionalAnalyses(regionId)
  const activeAnalysis = regionalAnalysisCollection.data.find(
    (ra) => ra._id === analysisId
  )
  const {data: jobs} = useRegionalJobs(regionId)

  return (
    <InnerDock>
      {activeAnalysis ? (
        <ResultsPage
          analysis={activeAnalysis}
          jobs={jobs}
          query={query}
          regionalAnalysisCollection={regionalAnalysisCollection}
        />
      ) : (
        <SelectPage
          allAnalyses={regionalAnalysisCollection.data}
          jobs={jobs}
          regionId={regionId}
        />
      )}
    </InnerDock>
  )
}

Object.assign(RegionalPage, {Layout: MapLayout})
