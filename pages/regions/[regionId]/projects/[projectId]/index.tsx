import {loadBundle} from 'lib/actions'
import {getForProject as loadModifications} from 'lib/actions/modifications'
import {loadProject} from 'lib/actions/project'
import {loadRegion} from 'lib/actions/region'
import List from 'lib/components/modification/list'
import ProjectTitle from 'lib/components/project-title'
import SelectProject from 'lib/components/select-project'
import MapLayout from 'lib/layouts/map'
import withInitialFetch from 'lib/with-initial-fetch'

const noProjectId = (pid) => !pid || pid === 'undefined'

/**
 * Show Select Project if a project has not been selected
 */
const ModificationsPage: any = withInitialFetch(
  ({bundle, project, region}) => {
    if (!project) {
      return <SelectProject region={region._id} />
    } else {
      return (
        <>
          <ProjectTitle project={project} />
          <List bundle={bundle} project={project} />
        </>
      )
    }
  },
  async (dispatch, query) => {
    const {projectId, regionId} = query
    if (noProjectId(projectId)) {
      return {region: await dispatch(loadRegion(regionId))}
    } else {
      const results = await Promise.all([
        dispatch(loadProject(projectId)),
        dispatch(loadModifications(projectId))
      ])
      const project = results[1]
      const bundle = await dispatch(loadBundle(project.bundleId))
      return {
        bundle,
        project,
        modifications: results[1]
      }
    }
  }
)

ModificationsPage.Layout = MapLayout

export default ModificationsPage
