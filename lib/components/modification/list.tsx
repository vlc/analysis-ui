import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels
} from '@chakra-ui/react'
import fpGet from 'lodash/fp/get'
import toStartCase from 'lodash/startCase'
import {memo, useEffect, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import getFeedsRoutesAndStops from 'lib/actions/get-feeds-routes-and-stops'
import useRouteTo from 'lib/hooks/use-route-to'
import message from 'lib/message'
import ScenariosEditor from 'lib/scenario/components/editor'
import selectFeedsById from 'lib/selectors/feeds-by-id'

import IconButton from '../icon-button'
import {HideIcon, SearchIcon, ShowIcon, UploadIcon} from '../icons'
import InnerDock from '../inner-dock'
import Link from '../link'
import {DisplayAll as ModificationsMap} from '../modifications-map/display-all'

import CreateModification from './create'
import useModificationsOnMap from 'lib/modification/hooks/use-modifications-on-map'

function filterModifications(
  filter: string,
  modifications: CL.IModification[],
  projectId: string
) {
  const filterLcase = filter != null ? filter.toLowerCase() : ''
  const filteredModificationsByType = {}

  modifications
    .filter((m) => m.projectId === projectId)
    .filter(
      (m) => filter === null || m.name?.toLowerCase().indexOf(filterLcase) > -1
    )
    .forEach((m) => {
      filteredModificationsByType[m.type] = [
        ...(filteredModificationsByType[m.type] || []),
        m
      ]
    })

  return filteredModificationsByType
}

const selectModifications = fpGet('project.modifications')
const EMPTY_ARRAY = []

export default function ModificationsList({project}) {
  const modificationsOnMap = useModificationsOnMap()
  const dispatch = useDispatch()
  const {_id: projectId, bundleId, regionId} = project
  // Retrieve the modifications from the store. Filter out modifications that might be from another project
  const modifications: CL.IModification[] = useSelector(selectModifications)
  const feedsById = useSelector(selectFeedsById)
  const goToModificationImport = useRouteTo('modificationImport', {
    projectId,
    regionId
  })
  const modificationIdsOnMap =
    modificationsOnMap.state[projectId] ?? EMPTY_ARRAY

  // Load the GTFS information for the modifications
  useEffect(() => {
    if (modificationIdsOnMap.length > 0) {
      dispatch(
        getFeedsRoutesAndStops({
          bundleId,
          forceCompleteUpdate: true,
          modifications: modifications.filter((m) =>
            modificationIdsOnMap.includes(m._id)
          )
        })
      )
    }
  }, [bundleId, dispatch, modifications, modificationIdsOnMap])

  const [filter, setFilter] = useState('')
  const [filteredModificationsByType, setFiltered] = useState(() =>
    filterModifications(filter, modifications, projectId)
  )

  // Update filtered modifications when the filter changes
  useEffect(() => {
    setFiltered(filterModifications(filter, modifications, projectId))
  }, [filter, modifications, projectId])

  return (
    <>
      <ModificationsMap
        feedsById={feedsById}
        modifications={modificationsOnMap}
      />

      <Tabs isFitted isLazy width='320px'>
        <TabList>
          <Tab _focus={{outline: 'none'}}>
            {message('modification.plural')}{' '}
            <Badge ml={2}>{modifications.length}</Badge>
          </Tab>
          <Tab _focus={{outline: 'none'}}>{message('variant.plural')}</Tab>
        </TabList>

        <TabPanels>
          <TabPanel pt={2} px={0}>
            <Box px={2}>
              <CreateModification />
            </Box>
            <Flex align='center' justify='space-between' p={2}>
              <InputGroup flex='1' pl={2}>
                <InputLeftElement pl={4} pr={2}>
                  <SearchIcon />
                </InputLeftElement>
                <Input
                  placeholder={message('modification.filter')}
                  onChange={(e) => setFilter(e.target.value)}
                  type='text'
                  value={filter}
                  variant='flushed'
                />
              </InputGroup>
              <Flex ml={2}>
                <IconButton
                  label={message('modification.importFromProject')}
                  onClick={goToModificationImport}
                >
                  <UploadIcon />
                </IconButton>
                <IconButton
                  label='Show all modifications'
                  onClick={() =>
                    modificationsOnMap.setAll(
                      projectId,
                      modifications.map((m) => m._id)
                    )
                  }
                >
                  <ShowIcon />
                </IconButton>
                <IconButton
                  label='Hide all modifications'
                  onClick={() => modificationsOnMap.setAll(projectId, [])}
                >
                  <HideIcon />
                </IconButton>
              </Flex>
            </Flex>

            <InnerDock>
              {modifications.length > 0 ? (
                <Accordion
                  allowMultiple
                  defaultIndex={Object.keys(filteredModificationsByType).map(
                    (_, i) => i
                  )}
                >
                  {Object.keys(filteredModificationsByType).map((type) => {
                    const ms = filteredModificationsByType[type]
                    return (
                      <ModificationType
                        key={type}
                        modificationCount={ms.length}
                        type={type}
                      >
                        {ms.map((m) => (
                          <ModificationItem
                            isDisplayed={modificationsOnMap.isOnMap(
                              projectId,
                              m._id
                            )}
                            key={m._id}
                            modification={m}
                            regionId={regionId}
                            toggleMapDisplay={() =>
                              modificationsOnMap.toggle(projectId, m._id)
                            }
                          />
                        ))}
                      </ModificationType>
                    )
                  })}
                </Accordion>
              ) : (
                <Box p={4} textAlign='center'>
                  No modifications have been added to this project yet.
                </Box>
              )}
            </InnerDock>
          </TabPanel>

          <TabPanel p={0}>
            <ScenariosEditor projectId={projectId} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  )
}

function ModificationType({children, modificationCount, type}) {
  return (
    <AccordionItem border='none' isDisabled={modificationCount === 0}>
      {({isExpanded}) => (
        <>
          <h3>
            <AccordionButton _focus={{outline: 'none'}} py={2}>
              <Box flex='1' fontWeight='bold' textAlign='left'>
                {toStartCase(type)} <Badge>{modificationCount}</Badge>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h3>
          <AccordionPanel py={0} px={1}>
            {isExpanded && <Flex direction='column'>{children}</Flex>}
          </AccordionPanel>
        </>
      )}
    </AccordionItem>
  )
}

type ModificationItemProps = {
  isDisplayed: boolean
  modification: CL.IModification
  regionId: string
  toggleMapDisplay: (_id: string) => void
}

const ModificationItem = memo<ModificationItemProps>(
  ({isDisplayed, modification, regionId, toggleMapDisplay}) => (
    <Flex align='center' px={1}>
      <Link
        to='modificationEdit'
        query={{
          modificationId: modification._id,
          projectId: modification.projectId,
          regionId
        }}
      >
        <Button
          aria-label={`Edit modification ${modification.name}`}
          flex='1'
          justifyContent='start'
          overflow='hidden'
          px={4}
          style={{textOverflow: 'ellipsis'}}
          variant='ghost'
          colorScheme='blue'
          whiteSpace='nowrap'
        >
          {modification.name}
        </Button>
      </Link>
      <IconButton
        label={isDisplayed ? 'Hide from map' : 'Show on map'}
        onClick={(e) => {
          e.preventDefault()
          toggleMapDisplay(modification._id)
        }}
      >
        {isDisplayed ? <ShowIcon /> : <HideIcon />}
      </IconButton>
    </Flex>
  )
)
