import {Box, Skeleton, Stack} from '@chakra-ui/core'
import {faCube} from '@fortawesome/free-solid-svg-icons'

import {useProjects} from 'lib/hooks/use-collection'
import useRouteTo from 'lib/hooks/use-route-to'
import message from 'lib/message'

import Icon from './icon'
import ListGroupItem from './list-group-item'

export default function Projects({regionId}) {
  const {data: projects, error} = useProjects({query: {regionId}})
  if (error) return <>{error.message}</>
  if (!projects) return <Skeleton mx={2} height='30px' />
  if (projects.length === 0) return null
  return (
    <Stack spacing={4}>
      <Box textAlign='center'>{message('project.goToExisting')}</Box>
      <Stack px={2} spacing={0}>
        {projects.map((project) => (
          <Project key={project._id} project={project} />
        ))}
      </Stack>
    </Stack>
  )
}

function Project({project, ...p}) {
  const goToModifications = useRouteTo('modifications', {
    regionId: project.regionId,
    projectId: project._id
  })
  return (
    <ListGroupItem
      leftIcon={() => (
        <Box pr={3}>
          <Icon icon={faCube} />
        </Box>
      )}
      onClick={goToModifications}
      {...p}
    >
      {project.name}
    </ListGroupItem>
  )
}
