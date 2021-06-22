import dynamic from 'next/dynamic'

import useModificationsOnMap from 'lib/modification/hooks/use-modifications-on-map'
import {useModifications} from 'lib/hooks/use-collection'

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
  project,
  isEditingId
}: {
  project: CL.Project
  isEditingId?: string
}) {
  const {data: modifications} = useModifications({
    query: {projectId: project._id}
  })
  const modificationsOnMap = useModificationsOnMap()
  const ids = modificationsOnMap.state[project._id] ?? []

  return (
    <DisplayAll
      bundleId={project.bundleId}
      isEditing={!!isEditingId}
      modifications={modifications.filter(
        (m) => m._id !== isEditingId && ids.includes(m._id)
      )}
    />
  )
}
