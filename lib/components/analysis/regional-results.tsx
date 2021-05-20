import {
  Alert,
  AlertIcon,
  Box,
  Heading,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import get from 'lodash/get'
import {useEffect} from 'react'
import MapControl from 'react-leaflet-control'
import {useDispatch, useSelector} from 'react-redux'

import {loadRegionalAnalysisGrid} from 'lib/actions/analysis/regional'
import message from 'lib/message'
import {activeOpportunityDataset} from 'lib/modules/opportunity-datasets/selectors'
import selectAggregateAccessibility from 'lib/selectors/aggregate-accessibility'
import selectComparisonAA from 'lib/selectors/comparison-aggregate-accessibility'
import selectComparisonCutoff from 'lib/selectors/regional-comparison-cutoff'
import selectComparisonPercentile from 'lib/selectors/regional-comparison-percentile'
import selectComparisonPointSet from 'lib/selectors/regional-comparison-destination-pointset'
import selectDisplayCutoff from 'lib/selectors/regional-display-cutoff'
import selectDisplayGrid from 'lib/selectors/regional-display-grid'
import selectDisplayPercentile from 'lib/selectors/regional-display-percentile'
import selectPointSet from 'lib/selectors/regional-display-destination-pointset'
import selectDisplayScale from 'lib/selectors/regional-display-scale'

import Legend from './legend'
import AggregationArea from './aggregation-area'
import AggregateAccessibility from './aggregate-accessibility'

function getNumberWithOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

function createAccessibilityLabel(analysis, gridName, cutoff, percentile) {
  if (!analysis) return
  if (Array.isArray(analysis.travelTimePercentiles)) {
    return message('analysis.accessTo', {
      opportunity: gridName,
      cutoff,
      percentile: getNumberWithOrdinal(percentile)
    })
  }
  if (analysis.travelTimePercentile === -1) {
    return message('analysis.accessToInstantaneous', {
      opportunity: gridName,
      cutoff: analysis.cutoffMinutes
    })
  }
  return message('analysis.accessTo', {
    opportunity: gridName,
    cutoff: analysis.cutoffMinutes,
    percentile: getNumberWithOrdinal(analysis.travelTimePercentile)
  })
}

function useComparisonAccessibilityLabel(comparisonAnalysis) {
  const comparisonPointSet = useSelector(selectComparisonPointSet)
  const comparisonCutoff = useSelector(selectComparisonCutoff)
  const comparisonPercentile = useSelector(selectComparisonPercentile)

  return comparisonAnalysis
    ? createAccessibilityLabel(
        comparisonAnalysis,
        get(comparisonPointSet, 'name'),
        comparisonCutoff,
        comparisonPercentile
      )
    : null
}

/**
 * Render a regional analysis results.
 */
export default function RegionalResults({
  analysis,
  comparisonAnalysis
}: {
  analysis: CL.RegionalAnalysis
  comparisonAnalysis?: CL.RegionalAnalysis
}) {
  const dispatch = useDispatch()
  const legendBackround = useColorModeValue('white', 'gray.900')

  const opportunityDataset = useSelector(activeOpportunityDataset)
  const aggregateAccessibility = useSelector(selectAggregateAccessibility)
  const comparisonAggregateAccessibility = useSelector(selectComparisonAA)
  const comparisonPointSet = useSelector(selectComparisonPointSet)
  const displayGrid = useSelector(selectDisplayGrid)
  const displayScale = useSelector(selectDisplayScale)
  const cutoff = useSelector(selectDisplayCutoff)
  const percentile = useSelector(selectDisplayPercentile)
  const pointSet = useSelector(selectPointSet)

  // For easier comparison later
  const pointSetId = get(pointSet, '_id')

  // Load the grid on mount and when the settings are changed.
  useEffect(() => {
    dispatch(loadRegionalAnalysisGrid(analysis, cutoff, percentile, pointSetId))
  }, [analysis, cutoff, percentile, pointSetId, dispatch])

  const aggregationWeightName = get(opportunityDataset, 'name')

  const accessToLabel = createAccessibilityLabel(
    analysis,
    get(pointSet, 'name'),
    cutoff,
    percentile
  )
  const comparisonAccessToLabel = useComparisonAccessibilityLabel(
    comparisonAnalysis
  )

  return (
    <>
      <MapControl position='bottomleft'>
        <Stack
          bg={legendBackround}
          boxShadow='lg'
          rounded='md'
          spacing={3}
          width='296px'
        >
          <Heading pt={4} px={4} size='sm'>
            Access to
          </Heading>

          <Box px={4}>
            <Heading size='xs'>{analysis.name}</Heading>
            <Text>{accessToLabel}</Text>
          </Box>
          {comparisonAnalysis && (
            <Box px={4}>
              <Text color='red.500'>
                <em>minus</em>
              </Text>
              <Heading size='xs'>{comparisonAnalysis.name}</Heading>
              <Text>{comparisonAccessToLabel}</Text>
            </Box>
          )}

          {displayGrid && displayScale ? (
            displayScale.error ? (
              <Alert roundedBottom='md' status='warning'>
                <AlertIcon />
                Data not suitable for generating a color scale.
              </Alert>
            ) : displayScale.breaks.length === 0 ? (
              <Alert roundedBottom='md' status='warning'>
                <AlertIcon />
                There is no data to show.
              </Alert>
            ) : (
              <Legend
                breaks={displayScale.breaks}
                min={displayGrid.min}
                colors={displayScale.colorRange}
              />
            )
          ) : (
            <Text p={4}>Loading grids...</Text>
          )}
        </Stack>
      </MapControl>

      <Stack spacing={4} py={4}>
        <Box p={4}>
          <AggregationArea regionId={analysis.regionId} />
        </Box>

        {analysis && aggregateAccessibility && aggregationWeightName && (
          <Box px={4}>
            <AggregateAccessibility
              aggregateAccessibility={aggregateAccessibility}
              comparisonAggregateAccessibility={
                comparisonAggregateAccessibility
              }
              weightByName={aggregationWeightName}
              accessToName={pointSet.name}
              regionalAnalysisName={analysis.name}
              comparisonAccessToName={
                comparisonAnalysis ? get(comparisonPointSet, 'name') : ''
              }
              comparisonRegionalAnalysisName={get(comparisonAnalysis, 'name')}
            />
          </Box>
        )}
      </Stack>
    </>
  )
}
