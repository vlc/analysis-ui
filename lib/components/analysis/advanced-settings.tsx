import {Box, Stack} from '@chakra-ui/react'
import useRegionalAnalyses from 'lib/hooks/use-regional-analyses'

import R5Selector from 'lib/modules/r5-version/components/selector'

import CustomBoundsSelector from './custom-bounds-selector'

/**
 * Edit the advanced parameters of an analysis.
 */
export default function AdvancedSettings({
  disabled,
  profileRequest,
  regionBounds,
  regionId,
  updateProfileRequest
}: {
  disabled: boolean
  profileRequest: CL.ProfileRequest
  regionBounds: CL.Bounds
  regionId: string
  updateProfileRequest: (profileRequest: Partial<CL.ProfileRequest>) => void
}) {
  const {data: regionalAnalyses} = useRegionalAnalyses(regionId)
  return (
    <Stack isInline spacing={5}>
      <Box flex='1'>
        <R5Selector
          isDisabled={disabled}
          onChange={(workerVersion) => updateProfileRequest({workerVersion})}
          regionalAnalyses={regionalAnalyses}
          value={profileRequest.workerVersion}
        />
      </Box>

      <Box flex='1'>
        <CustomBoundsSelector
          isDisabled={disabled}
          profileRequest={profileRequest}
          regionalAnalyses={regionalAnalyses}
          regionBounds={regionBounds}
          updateProfileRequest={updateProfileRequest}
        />
      </Box>
    </Stack>
  )
}
