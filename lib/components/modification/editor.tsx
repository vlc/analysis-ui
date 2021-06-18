import {
  Alert,
  AlertIcon,
  Box,
  Divider,
  Flex,
  Stack,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  useToast,
  AlertDescription
} from '@chakra-ui/react'
import get from 'lodash/get'
import {useCallback, useState} from 'react'

import {useBundle, useModification} from 'lib/hooks/use-model'
import useRouteTo from 'lib/hooks/use-route-to'
import message from 'lib/message'
import copyModification from 'lib/modification/mutations/copy'

import {ConfirmDialog} from '../confirm-button'
import Editable from '../editable'
import IconButton from '../icon-button'
import {ChevronLeft, CodeIcon, CopyIcon, DeleteIcon, MouseIcon} from '../icons'
import InnerDock from '../inner-dock'
import AllModificationsMapDisplay from '../modifications-map/display-all'

import FitBoundsButton from './fit-bounds'
import JSONEditor from './json-editor'
import ModificationType from './type'

// Test modification name is valid
const nameIsValid = (s) => s && s.length > 0

/**
 * Show this toast when a modification has been copied.
 */
function CopiedModificationToast({
  modificationId,
  onClose,
  projectId,
  regionId
}) {
  const goToModificationEdit = useRouteTo('modificationEdit', {
    modificationId,
    projectId,
    regionId
  })

  return (
    <Alert
      status='success'
      variant='solid'
      mt={2}
      cursor='pointer'
      onClick={() => {
        goToModificationEdit()
        onClose()
      }}
    >
      <AlertIcon />
      <AlertDescription>
        <Box _hover={{textDecoration: 'underline'}}>
          Modification has been copied successfully. Click here to go to the new
          copy.
        </Box>
      </AlertDescription>
    </Alert>
  )
}

export default function ModificationEditor(p: {
  modification: CL.Modification
  project: CL.Project
  query: CL.Query
}) {
  const toast = useToast({position: 'top', isClosable: true, status: 'success'})
  const {data: bundle} = useBundle(p.project.bundleId)
  const {remove, update} = useModification(p.modification._id, {
    initialData: p.modification
  })
  const [modification, setLocalModification] = useState(p.modification)

  const goToAllModifications = useRouteTo('modifications', {
    regionId: p.query.regionId,
    projectId: p.query.projectId
  })

  const updateLocally = useCallback(
    (p: Partial<CL.IModification>) =>
      setLocalModification((m) => ({
        ...m,
        ...p
      })),
    [setLocalModification]
  )

  const _save = useCallback(async () => {
    const res = await update(modification)
    if (res.ok === true) setLocalModification(res.data)
  }, [modification, update])

  const _remove = useCallback(async () => {
    // Delete the modification
    const res = await remove()
    if (res.ok === true) {
      // Go to the all modifications page
      goToAllModifications()
      // Show a toast confirming deletion
      toast({
        title: `Modification "${modification.name}" deleted successfully`
      })
    }
  }, [modification, goToAllModifications, remove, toast])

  const _copyModification = useCallback(async () => {
    const res = await copyModification(modification._id)
    if (res.ok) {
      toast({
        position: 'top',
        render: ({onClose}) => (
          <CopiedModificationToast
            modificationId={res.data._id}
            onClose={onClose}
            projectId={p.query.projectId}
            regionId={p.query.regionId}
          />
        )
      })
    }
  }, [modification, p.query, toast])

  return (
    <>
      {bundle && (
        <AllModificationsMapDisplay
          bundle={bundle}
          isEditingId={modification._id}
          project={p.project}
        />
      )}

      <Flex align='center' borderBottomWidth='1px' p={2} width='320px'>
        <IconButton label='Modifications' onClick={goToAllModifications}>
          <ChevronLeft />
        </IconButton>

        <Box flex='1' fontSize='xl' fontWeight='bold' ml={2} overflow='hidden'>
          <Editable
            isValid={nameIsValid}
            onChange={async (name) => updateLocally({name})}
            value={modification.name}
          />
        </Box>

        <Flex>
          <div>
            <FitBoundsButton />
          </div>
          <IconButton
            label={message('modification.copyModification')}
            onClick={() => _copyModification()}
          >
            <CopyIcon />
          </IconButton>
          <ConfirmDialog
            description={message('modification.deleteConfirmation')}
            onConfirm={_remove}
          >
            <IconButton
              label={message('modification.deleteModification')}
              colorScheme='red'
            >
              <DeleteIcon />
            </IconButton>
          </ConfirmDialog>
        </Flex>
      </Flex>
      <InnerDock>
        <Tabs align='end' p={4} variant='soft-rounded'>
          <TabPanels>
            <TabPanel p={0}>
              <Stack spacing={4}>
                <Box>
                  <Editable
                    onChange={async (description) =>
                      updateLocally({description})
                    }
                    placeholder={message('modification.addDescription')}
                    value={modification.description}
                  />
                </Box>

                {get(modification, 'routes.length') > 1 && (
                  <Alert status='warning'>
                    {message('modification.onlyOneRoute')}
                  </Alert>
                )}

                <Box>
                  <ModificationType
                    bundle={bundle}
                    modification={modification}
                    type={modification.type}
                    update={updateLocally}
                  />
                </Box>
              </Stack>
            </TabPanel>
            <TabPanel p={0}>
              <JSONEditor modification={modification} save={updateLocally} />
            </TabPanel>
          </TabPanels>

          <Divider my={4} />

          <TabList>
            <Tab aria-label='Edit value'>
              <MouseIcon />
            </Tab>
            <Tab aria-label='Edit JSON'>
              <CodeIcon />
            </Tab>
          </TabList>
        </Tabs>
      </InnerDock>
    </>
  )
}
