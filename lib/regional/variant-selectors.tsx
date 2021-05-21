import {
  Box,
  Select,
  Stack,
  Alert,
  AlertIcon,
  AlertDescription
} from '@chakra-ui/react'

import useControlledInput from 'lib/hooks/use-controlled-input'

import DestinationPointsetSelector from './destination-pointset-select'

export default function VariantSelectors({
  analysis,
  cutoff,
  percentile,
  pointSetId,
  onChangeCutoff,
  onChangePercentile,
  onChangePointSet
}: {
  analysis: CL.RegionalAnalysis
  cutoff: number
  percentile: number
  pointSetId: string
  onChangeCutoff: (cutoff: number) => void
  onChangePercentile: (percentile: number) => void
  onChangePointSet: (pointSetId: string) => void
}) {
  const cutoffsMinutes = analysis.cutoffsMinutes ?? []
  const percentiles = analysis.travelTimePercentiles ?? []
  const cutoffInput = useControlledInput({
    onChange: onChangeCutoff,
    parse: parseInt,
    value: cutoff
  })
  const percentileInput = useControlledInput({
    onChange: onChangePercentile,
    parse: parseInt,
    value: percentile
  })

  return (
    <Stack spacing={4} px={4} py={4}>
      {analysis?.request?.originPointSetKey != null ? (
        <Alert status='info'>
          <AlertIcon />
          <AlertDescription>
            Results for this analysis cannot be displayed on this map.
          </AlertDescription>
        </Alert>
      ) : (
        <Stack spacing={4}>
          {Array.isArray(analysis.destinationPointSetIds) && (
            <Box>
              <DestinationPointsetSelector
                analysis={analysis}
                onChange={onChangePointSet}
                value={pointSetId}
              />
            </Box>
          )}

          <Stack isInline>
            {Array.isArray(cutoffsMinutes) && (
              <Select {...cutoffInput}>
                {cutoffsMinutes.map((m) => (
                  <option key={m} value={m}>
                    {m} minutes
                  </option>
                ))}
              </Select>
            )}

            {Array.isArray(percentiles) && (
              <Select {...percentileInput}>
                {percentiles.map((p) => (
                  <option key={p} value={p}>
                    {p}th percentile
                  </option>
                ))}
              </Select>
            )}
          </Stack>
        </Stack>
      )}
    </Stack>
  )
}
