import InnerDock from 'lib/components/inner-dock'
import useRegionalAnalyses from 'lib/hooks/use-regional-analyses'
import SelectPage from 'lib/regional/components/select-page'
import useRegionalJobs from 'lib/regional/hooks/use-regional-jobs'

import withDataLayout, {IResults} from 'lib/with-data-layout'

interface PageProps extends IResults {
  allAnalyses: CL.RegionalAnalysis[]
  jobs: CL.RegionalJob[]
}

export default withDataLayout<PageProps>(
  function RegionalPage(p) {
    return (
      <InnerDock>
        <SelectPage
          allAnalyses={p.allAnalyses}
          jobs={p.jobs}
          regionId={p.query.regionId}
        />
      </InnerDock>
    )
  },
  function useData(p) {
    return {
      allAnalyses: useRegionalAnalyses(p.query.regionId),
      jobs: useRegionalJobs(p.query.regionId)
    }
  }
)
