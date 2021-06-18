import {Box, Flex} from '@chakra-ui/react'

import {ChevronLeft, DeleteIcon} from 'lib/components/icons'
import useRouteTo from 'lib/hooks/use-route-to'
import message from 'lib/message'

import {ConfirmDialog} from 'lib/components/confirm-button'
import Editable from 'lib/components/editable'
import IconButton from 'lib/components/icon-button'

import useRegionalAnalysis from '../hooks/use-regional-analysis'

// Ensure valid analysis name
const nameIsValid = (s) => s && s.length > 0

export default function RegionalHeading({
  analysis
}: {
  analysis: CL.RegionalAnalysis
}) {
  const goBack = useRouteTo('regionalAnalyses', {regionId: analysis.regionId})
  const analysisModel = useRegionalAnalysis(analysis._id, {
    initialData: analysis
  })

  async function _remove() {
    await analysisModel.remove()
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
          onChange={(name: string) => analysisModel.update({name})}
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
