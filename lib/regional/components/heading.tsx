import {Box, Flex} from '@chakra-ui/react'

import {ChevronLeft, DeleteIcon} from 'lib/components/icons'
import useRouteTo from 'lib/hooks/use-route-to'
import message from 'lib/message'
import {SafeResponse} from 'lib/utils/safe-fetch'

import {ConfirmDialog} from 'lib/components/confirm-button'
import Editable from 'lib/components/editable'
import IconButton from 'lib/components/icon-button'

// Ensure valid analysis name
const nameIsValid = (s) => s && s.length > 0

export default function RegionalHeading({
  analysis,
  remove,
  update
}: {
  analysis: CL.RegionalAnalysis
  remove: () => Promise<SafeResponse<CL.RegionalAnalysis>>
  update: (
    updates: Partial<CL.RegionalAnalysis>
  ) => Promise<SafeResponse<CL.RegionalAnalysis[]>>
}) {
  const goBack = useRouteTo('regionalAnalyses', {regionId: analysis.regionId})

  async function _remove() {
    await remove()
    return goBack()
  }

  return (
    <Flex align='center' borderBottomWidth='1px' p={2} width='320px'>
      <IconButton label='All regional analyses' onClick={goBack}>
        <ChevronLeft />
      </IconButton>

      <Box flex='1' fontSize='xl' fontWeight='bold' ml={2} overflow='hidden'>
        <Editable
          isValid={nameIsValid}
          onChange={(name: string) => update({name})}
          value={analysis.name}
        />
      </Box>

      <Flex>
        <ConfirmDialog
          description='Are you sure you would like to delete this analysis?'
          onConfirm={_remove}
        >
          <IconButton
            label={message('analysis.deleteRegionalAnalysis')}
            colorScheme='red'
          >
            <DeleteIcon />
          </IconButton>
        </ConfirmDialog>
      </Flex>
    </Flex>
  )
}
