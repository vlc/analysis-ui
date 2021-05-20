import {
  Box,
  Select,
  Stack,
  Flex,
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Alert,
  AlertIcon,
  AlertDescription,
  Center,
  useToast
} from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import {useRouter} from 'next/router'
import React, {useCallback} from 'react'

import {ChevronLeft, DeleteIcon, DownloadIcon} from 'lib/components/icons'
import {API} from 'lib/constants'
import useControlledInput from 'lib/hooks/use-controlled-input'
import useRouteTo, {useShallowRouteTo} from 'lib/hooks/use-route-to'
import useUser from 'lib/hooks/use-user'
import message from 'lib/message'
import authFetch, {authFetchText} from 'lib/utils/auth-fetch'
import downloadObjectAsJson from 'lib/utils/download-json'
import {SafeResponse} from 'lib/utils/safe-fetch'

import {ConfirmDialog} from '../confirm-button'
import Editable from '../editable'
import IconButton from '../icon-button'
import ActiveJob from 'lib/regional/active-job'

import DestinationPointsetSelector from './destination-pointset-select'

const AggregationArea = dynamic(() => import('../map/aggregation-area'), {
  ssr: false
})
const AnalysisBounds = dynamic(() => import('../map/analysis-bounds'), {
  ssr: false
})
const DotMap = dynamic(
  () => import('lib/modules/opportunity-datasets/components/dotmap'),
  {ssr: false}
)
const RegionalLayer = dynamic(() => import('../map/regional'), {
  ssr: false
})

// Ensure valid analysis name
const nameIsValid = (s) => s && s.length > 0

export default function Regional({
  analysis,
  job,
  remove,
  update
}: {
  analysis: CL.RegionalAnalysis
  job?: CL.RegionalJob
  remove: () => Promise<SafeResponse<CL.RegionalAnalysis>>
  update: (
    updates: Partial<CL.RegionalAnalysis>
  ) => Promise<SafeResponse<CL.RegionalAnalysis[]>>
}) {
  const isComplete = job == null
  const cutoffsMinutes = analysis.cutoffsMinutes ?? []
  const percentiles = analysis.travelTimePercentiles ?? []
  const router = useRouter()
  const query = router.query as CL.Query
  const goBack = useRouteTo('regionalAnalyses')
  const routeTo = useShallowRouteTo('regionalAnalyses', {
    analysisId: analysis._id
  })

  const onChangeCutoff = useCallback((v) => routeTo({cutoff: v}), [routeTo])
  const cutoffInput = useControlledInput({
    onChange: onChangeCutoff,
    parse: parseInt,
    value: query.cutoff
  })

  const onChangePercentile = useCallback((v) => routeTo({percentile: v}), [
    routeTo
  ])
  const percentileInput = useControlledInput({
    onChange: onChangePercentile,
    parse: parseInt,
    value: query.percentile
  })

  const activePointSetId = query.destinationPointSetId
  const onChangeDestinationPointSet = useCallback(
    (v) => routeTo({destinationPointSetId: v}),
    [routeTo]
  )

  async function _remove() {
    await remove()
    return goBack()
  }

  return (
    <>
      {!isComplete ? (
        <AnalysisBounds analysis={analysis} />
      ) : (
        <>
          <DotMap />
          <RegionalLayer />
          <AggregationArea />
        </>
      )}

      <Flex align='center' borderBottomWidth='1px' p={2} width='320px'>
        <IconButton label='All regional analyses' onClick={goBack}>
          <ChevronLeft />
        </IconButton>

        <Box flex='1' fontSize='xl' fontWeight='bold' ml={2} overflow='hidden'>
          <Editable
            isValid={nameIsValid}
            onChange={(name) => update({name})}
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

      {job && <ActiveJob job={job} />}

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
                  onChange={onChangeDestinationPointSet}
                  value={activePointSetId}
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

        {isComplete && (
          <Box>
            <DownloadMenu
              analysis={analysis}
              cutoff={cutoffInput.value}
              percentile={percentileInput.value}
              pointSetId={activePointSetId}
            />
          </Box>
        )}
      </Stack>
    </>
  )
}

// Type to title
const csvResultsTypeToTitle = {
  ACCESS: 'Access CSV',
  PATHS: 'Paths CSV',
  TIMES: 'Times CSV'
}

function DownloadMenu({
  analysis,
  cutoff,
  percentile,
  pointSetId
}: {
  analysis: CL.RegionalAnalysis
  cutoff: number
  percentile: number
  pointSetId: string
}) {
  const {user} = useUser()
  const toast = useToast({
    position: 'top',
    status: 'error',
    title: 'Download failed'
  })
  async function _downloadCSVResults(type: string) {
    const res = await authFetchText(
      `${API.Regional}/${analysis._id}/csv/${type}`,
      user
    )
    if (res.ok) {
      window.open(res.data)
    } else if (res.ok === false) {
      toast({description: res.error.message})
    }
  }

  async function _downloadRequestJSON() {
    const res = await authFetch(`${API.Regional}/${analysis._id}`, user)
    if (res.ok) {
      downloadObjectAsJson({
        data: res.data,
        filename: analysis.name + '.json'
      })
    } else if (res.ok === false) {
      toast({description: res.error.message})
    }
  }

  /**
   * Perform an authenticated fetch to get a presigned URL to download a grid
   * from S3, then download it. Pass in the path to fetch.
   */
  async function _downloadProjectGIS(e) {
    e.preventDefault()
    const res = await authFetch<{url: string}>(
      `${API.Regional}/${analysis._id}/grid/tiff?cutoff=${cutoff}&percentile=${percentile}&destinationPointSetId=${pointSetId}`,
      user
    )
    if (res.ok) {
      window.open(res.data.url)
    } else if (res.ok === false) {
      toast({description: res.error.message})
    }
  }

  return (
    <Menu isLazy>
      <MenuButton as={Button} colorScheme='blue'>
        <Center>
          <DownloadIcon />
          &nbsp; Download results
        </Center>
      </MenuButton>
      <MenuList>
        <MenuItem
          isDisabled={analysis.request.originPointSetKey != null}
          onClick={_downloadProjectGIS}
        >
          GeoTIFF
        </MenuItem>
        <MenuItem onClick={_downloadRequestJSON}>
          Scenario and modification JSON
        </MenuItem>
        {Object.keys(analysis.resultStorage || {}).map((type) => (
          <MenuItem key={type} onClick={() => _downloadCSVResults(type)}>
            {csvResultsTypeToTitle[type]}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}
