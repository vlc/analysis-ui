import {Box} from '@chakra-ui/react'
import get from 'lodash/get'
import {useEffect} from 'react'
import {useDispatch, useSelector} from 'react-redux'

import {loadRegionalAnalysisGrid} from 'lib/actions/analysis/regional'
import {activeOpportunityDataset} from 'lib/modules/opportunity-datasets/selectors'
import selectAggregateAccessibility from 'lib/selectors/aggregate-accessibility'
import selectComparisonAA from 'lib/selectors/comparison-aggregate-accessibility'
import selectComparisonPointSet from 'lib/selectors/regional-comparison-destination-pointset'
import selectDisplayCutoff from 'lib/selectors/regional-display-cutoff'
import selectDisplayPercentile from 'lib/selectors/regional-display-percentile'
import selectPointSet from 'lib/selectors/regional-display-destination-pointset'

import AggregateAccessibility from './aggregate-accessibility'

/**
 * Render a regional analysis results.
 */
export default function Aggregation({
  analysis,
  comparisonAnalysis
}: {
  analysis: CL.RegionalAnalysis
  comparisonAnalysis?: CL.RegionalAnalysis
}) {
  const dispatch = useDispatch()

  const opportunityDataset = useSelector(activeOpportunityDataset)
  const aggregateAccessibility = useSelector(selectAggregateAccessibility)
  const comparisonAggregateAccessibility = useSelector(selectComparisonAA)
  const comparisonPointSet = useSelector(selectComparisonPointSet)
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

  return (
    analysis &&
    aggregateAccessibility &&
    aggregationWeightName && (
      <Box px={4}>
        <AggregateAccessibility
          aggregateAccessibility={aggregateAccessibility}
          comparisonAggregateAccessibility={comparisonAggregateAccessibility}
          weightByName={aggregationWeightName}
          accessToName={pointSet.name}
          regionalAnalysisName={analysis.name}
          comparisonAccessToName={
            comparisonAnalysis ? get(comparisonPointSet, 'name') : ''
          }
          comparisonRegionalAnalysisName={get(comparisonAnalysis, 'name')}
        />
      </Box>
    )
  )
}
