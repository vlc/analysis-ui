import {Button, Heading, Stack, Flex} from '@chakra-ui/core'
import {faCog, faDatabase, faMap} from '@fortawesome/free-solid-svg-icons'

import useRouteTo from 'lib/hooks/use-route-to'
import message from 'lib/message'

import Icon from './icon'
import IconButton from './icon-button'
import InnerDock from './inner-dock'
import Projects from './projects'

export default function SelectProject({region}) {
  const routeToBundleCreate = useRouteTo('bundleCreate', {regionId: region._id})
  const routeToProjectCreate = useRouteTo('projectCreate', {
    regionId: region._id
  })
  const routeToRegionSettings = useRouteTo('regionSettings', {
    regionId: region._id
  })

  return (
    <InnerDock>
      <Stack py={4} spacing={4} px={2}>
        <Flex align='center' pl={2}>
          <Heading flex='1' size='md'>
            <Icon icon={faMap} /> {region.name}
          </Heading>
          <IconButton
            label='Edit region settings'
            icon={faCog}
            onClick={routeToRegionSettings}
          />
        </Flex>

        <Stack px={2}>
          <Button
            isFullWidth
            leftIcon='small-add'
            onClick={routeToProjectCreate}
            variantColor='green'
          >
            {message('project.createAction')}
          </Button>
          <Button
            isFullWidth
            onClick={routeToBundleCreate}
            variantColor='green'
          >
            <Icon icon={faDatabase} />
            &nbsp;&nbsp;{message('project.uploadBundle')}
          </Button>
        </Stack>

        <Projects regionId={region._id} />
      </Stack>
    </InnerDock>
  )
}
