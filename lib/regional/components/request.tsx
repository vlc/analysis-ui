import {Box, Button, Stack, useDisclosure} from '@chakra-ui/react'
import get from 'lodash/get'

import {useBundle, useProject} from 'lib/hooks/use-model'
import {secondsToHhMmString} from 'lib/utils/time'

import {ChevronUp, ChevronDown} from 'lib/components/icons'
import {ALink} from 'lib/components/link'
import ModeSummary from 'lib/components/mode-summary'
import ObjectToTable, {TDTitle, TDValue} from 'lib/components/object-to-table'
import Tip from 'lib/components/tip'

const PROJECT_CHANGE_NOTE =
  'Notice: project may have changed since the analysis was run.'

/** Display the parameters of a regional profile request */
export default function RequestDisplay({
  analysis,
  color = 'blue'
}: {
  analysis: CL.RegionalAnalysis
  color?: 'blue' | 'red'
}) {
  const {data: project} = useProject(analysis.projectId)
  const {data: bundle} = useBundle(analysis.bundleId)
  const {onToggle, isOpen} = useDisclosure()
  const {request} = analysis
  const scenarioName =
    analysis.variant > -1
      ? get(project, `variants[${analysis.variant}]`, 'Unknown')
      : 'Baseline'

  return (
    <Stack>
      <Box
        as='table'
        style={{
          tableLayout: 'fixed'
        }}
        width='100%'
      >
        <tbody>
          {bundle && (
            <tr>
              <TDTitle>Bundle</TDTitle>
              <TDValue>
                <ALink
                  to='bundle'
                  query={{
                    bundleId: bundle._id,
                    regionId: bundle.regionId
                  }}
                >
                  {bundle.name}
                </ALink>
              </TDValue>
            </tr>
          )}
          {project && (
            <tr>
              <TDTitle>Project</TDTitle>
              <TDValue>
                <Tip label={PROJECT_CHANGE_NOTE}>
                  <div>
                    <ALink
                      to='modifications'
                      query={{
                        projectId: project._id,
                        regionId: project.regionId
                      }}
                    >
                      {project.name}
                    </ALink>
                  </div>
                </Tip>
              </TDValue>
            </tr>
          )}
          <tr>
            <TDTitle>Scenario</TDTitle>
            <TDValue>{scenarioName}</TDValue>
          </tr>
          <tr>
            <TDTitle>Service Date</TDTitle>
            <TDValue>{request.date}</TDValue>
          </tr>
          <tr>
            <TDTitle>Service Time</TDTitle>
            <TDValue>
              {secondsToHhMmString(request.fromTime)}-
              {secondsToHhMmString(request.toTime)}
            </TDValue>
          </tr>
          <tr>
            <TDTitle>Modes</TDTitle>
            <TDValue>
              <ModeSummary
                accessModes={request.accessModes}
                color={color}
                egressModes={request.egressModes}
                transitModes={request.transitModes}
              />
            </TDValue>
          </tr>
          <tr>
            <td colSpan={2}></td>
          </tr>
        </tbody>
      </Box>

      <Box borderBottomWidth='1px'>
        <Button
          borderRadius='0'
          _focus={{
            outline: 'none'
          }}
          onClick={onToggle}
          size='sm'
          title={isOpen ? 'collapse' : 'expand'}
          variant='ghost'
          colorScheme={color}
          width='100%'
        >
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </Button>
        {isOpen && <ObjectToTable color={color} object={request} />}
      </Box>
    </Stack>
  )
}
