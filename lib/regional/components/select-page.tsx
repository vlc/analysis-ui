import {Alert, AlertIcon, Box, Heading, Stack} from '@chakra-ui/react'
import {useCallback} from 'react'

import Select from 'lib/components/select'
import useControlledInput from 'lib/hooks/use-controlled-input'
import useRouteTo from 'lib/hooks/use-route-to'

import {getDefaultVariants} from '../utils'

import ActiveJob from './active-job'

/**
 * Component for selecting a regional analysis and displaying active jobs.
 */
export default function RegionalSelectPage({
  allAnalyses,
  jobs,
  regionId
}: {
  allAnalyses: CL.RegionalAnalysis[]
  jobs: CL.RegionalJob[]
  regionId: string
}) {
  const goToRegional = useRouteTo('regionalAnalyses', {regionId})
  const onChange = useCallback(
    (a?: CL.RegionalAnalysis) =>
      a == null
        ? goToRegional()
        : goToRegional({analysisId: a._id, ...getDefaultVariants(a)}),
    [goToRegional]
  )
  const input = useControlledInput({
    onChange,
    value: null
  })

  // Analyses are deleted before the jobs get cleared
  const jobsWithAnalysis = jobs.filter(
    (j) => allAnalyses.findIndex((a) => j.jobId === a._id) !== -1
  )
  return (
    <Stack spacing={4} py={4}>
      <Heading size='md' px={4}>
        Regional Analyses
      </Heading>

      {allAnalyses.length === 0 && (
        <Alert status='warning'>
          <AlertIcon /> You have no running or completed regional analysis jobs!
          To create one, go to the single point analysis page.
        </Alert>
      )}
      <Box px={4}>
        <Select
          isClearable
          key={`analysis-${input.value}`} // Dont show deleted analyses as selected
          onChange={input.onChange}
          getOptionLabel={(v: CL.RegionalAnalysis) => v.name}
          getOptionValue={(v: CL.RegionalAnalysis) => v._id}
          options={allAnalyses}
          placeholder='View a regional analysis...'
          value={input.value}
        />
      </Box>
      <Stack spacing={0}>
        {jobsWithAnalysis.map((job) => (
          <Box
            borderBottom='1px solid #e2e8f0'
            _first={{
              borderTop: '1px solid #e2e8f0'
            }}
            key={job.jobId}
          >
            <ActiveJob job={job} />
          </Box>
        ))}
      </Stack>
    </Stack>
  )
}
