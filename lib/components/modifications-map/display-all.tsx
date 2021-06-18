import dynamic from 'next/dynamic'

import useModificationsOnMap from 'lib/modification/hooks/use-modifications-on-map'
import {useModifications} from 'lib/hooks/use-collection'

const Display = dynamic(() => import('./display'), {ssr: false})

export function DisplayAll({
  bundle,
  isEditing = false,
  modifications
}: {
  bundle: CL.Bundle
  isEditing?: boolean
  modifications: CL.Modification[]
}) {
  return (
    <>
      {modifications.map((m) => (
        <Display
          dim={isEditing}
          feedGroupId={bundle.feedGroupId}
          key={m._id}
          modification={m}
        />
      ))}
    </>
  )
}

export default function ConnectedDisplayAll({
  bundle,
  project,
  isEditingId
}: {
  bundle: CL.Bundle
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
      bundle={bundle}
      isEditing={!!isEditingId}
      modifications={modifications.filter(
        (m) => m._id !== isEditingId && ids.includes(m._id)
      )}
    />
  )
}
