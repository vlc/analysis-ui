import Report from 'lib/components/report'
import withData from 'lib/hocs/with-data'
import {useModifications} from 'lib/hooks/use-collection'
import {useProject} from 'lib/hooks/use-model'
import withAuth from 'lib/with-auth'
import withRedux from 'lib/with-redux'

const ReportPage = withData(Report, function useData(query) {
  const project = useProject(query.projectId)
  const modifications = useModifications()
  return {
    modifications: modifications.filter((m) => m.variants[query.index]),
    project
  }
})

export default withAuth(withRedux(ReportPage))
