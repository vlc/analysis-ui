import FullSpinner from 'lib/components/full-spinner'
import InnerDock from 'lib/components/inner-dock'
import MapLayout from 'lib/layouts/map'
import useRegionalAnalyses from 'lib/hooks/use-regional-analyses'
import SelectPage from 'lib/regional/components/select-page'
import useRegionalJobs from 'lib/regional/hooks/use-regional-jobs'

const RegionalPage: CL.Page = ({query}) => {
  const {regionId} = query
  const regionalAnalysisCollection = useRegionalAnalyses(regionId)
  const jobs = useRegionalJobs(regionId)

  return (
    <InnerDock>
      {jobs == null || regionalAnalysisCollection.data == null ? (
        <FullSpinner />
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

RegionalPage.Layout = MapLayout

export default RegionalPage
