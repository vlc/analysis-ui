import dynamic from 'next/dynamic'

import useModificationsOnMap from 'lib/modification/hooks/use-modifications-on-map'
import {useModifications} from 'lib/hooks/use-collection'
import useCurrentProject, {
  useCurrentProjectId
} from 'lib/hooks/use-current-project'

const Display = dynamic(() => import('./display'), {ssr: false})

export function DisplayAll({
  bundleId,
  isEditing = false,
  modifications
}: {
  bundleId: string
  isEditing?: boolean
  modifications: CL.Modification[]
}) {
  return (
    <>
      {modifications.map((m) => (
        <Display
          dim={isEditing}
          bundleId={bundleId}
          key={m._id}
          modification={m}
        />
      ))}
    </>
  )
}

export default function ConnectedDisplayAll({
  isEditingId
}: {
  isEditingId?: string | boolean
}) {
  const projectId = useCurrentProjectId()
  const project = useCurrentProject()
  const {data: modifications} = useModifications({
    query: {projectId: projectId}
  })
  const modificationsOnMap = useModificationsOnMap()
  const ids = modificationsOnMap.state[projectId] ?? []

  return project ? (
    <DisplayAll
      bundleId={project.bundleId}
      isEditing={!!isEditingId}
      modifications={modifications.filter(
        (m) => m._id !== isEditingId && ids.includes(m._id)
      )}
    />
  ) : null
}
