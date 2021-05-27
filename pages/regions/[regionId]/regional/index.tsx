import InnerDock from 'lib/components/inner-dock'
import MapLayout from 'lib/layouts/map'
import useRegionalAnalyses from 'lib/hooks/use-regional-analyses'
import useRegionalJobs from 'lib/hooks/use-regional-jobs'
import SelectPage from 'lib/regional/components/select-page'

const RegionalPage: CL.Page = ({query}) => {
  const {regionId} = query
  const regionalAnalysisCollection = useRegionalAnalyses(regionId)
  const {data: jobs} = useRegionalJobs(regionId)

  return (
    <InnerDock>
      <SelectPage
        allAnalyses={regionalAnalysisCollection.data}
        jobs={jobs}
        regionId={regionId}
      />
    </InnerDock>
  )
}

RegionalPage.Layout = MapLayout

export default RegionalPage
