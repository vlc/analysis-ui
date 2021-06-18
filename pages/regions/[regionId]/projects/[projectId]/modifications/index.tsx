import List from 'lib/components/modification/list'
import ProjectTitle from 'lib/components/project-title'
import withDataLayout from 'lib/hocs/with-data-layout'
import {useModifications} from 'lib/hooks/use-collection'
import {useProject} from 'lib/hooks/use-model'
import ModificationsOnMapProvider from 'lib/modification/components/modifications-on-map-provider'

export default withDataLayout(
  function ProjectPage(p: {
    modifications: CL.Modification[]
    project: CL.Project
  }) {
    return (
      <>
        <ProjectTitle project={p.project} />
        <ModificationsOnMapProvider>
          <List modifications={p.modifications} project={p.project} />
        </ModificationsOnMapProvider>
      </>
    )
  },
  function useData({query}) {
    return {
      project: useProject(query.projectId),
      modifications: useModifications({query: {projectId: query.projectId}})
    }
  }
)
