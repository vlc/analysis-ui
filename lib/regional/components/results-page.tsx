import {Alert, AlertIcon, FormControl, FormLabel} from '@chakra-ui/react'
import fpGet from 'lodash/fp/get'
import {useCallback} from 'react'

import AggregationAreas from 'lib/aggregation-area/components/select'
import Select from 'lib/components/select'
import {UseCollectionResponse} from 'lib/hooks/use-collection'
import useControlledInput from 'lib/hooks/use-controlled-input'
import {useShallowRouteTo} from 'lib/hooks/use-route-to'
import message from 'lib/message'

import AccessMap from './access-map'
import DownloadMenu from './download-menu'
import RegionalHeading from './heading'
import Legend from './legend'
import RequestDisplay from './request'
import VariantSelectors from './variant-selectors'

import {useRegionalAnalysisGrid} from '../api'
import {useDisplayGrid} from '../display-grid'
import {useDisplayScale} from '../display-scale'
import {getComparisonVariants, useVariant} from '../utils'

const getId = fpGet('_id')
const getName = fpGet('name')

/**
 * View an active or completed regional analysis.
 */
export default function ResultsPage({
  analysisVariant,
  comparisonAnalyses,
  query,
  regionalAnalysisCollection
}: {
  analysisVariant: CL.RegionalAnalysisVariant
  comparisonAnalyses: CL.RegionalAnalysis[]
  query: CL.Query
  regionalAnalysisCollection: UseCollectionResponse<CL.RegionalAnalysis>
}) {
  const {analysis} = analysisVariant
  const routeTo = useShallowRouteTo('regionalAnalysis')

  const onChangeComparisonAnalysis = useCallback(
    (v) =>
      v == null
        ? routeTo({comparisonAnalysisId: null})
        : routeTo({
            comparisonAnalysisId: v._id,
            ...getComparisonVariants(v, query)
          }),
    [query, routeTo]
  )
  const comparisonAnalysisInput = useControlledInput({
    onChange: onChangeComparisonAnalysis,
    value: regionalAnalysisCollection.data.find(
      (a) => a._id === query.comparisonAnalysisId
    )
  })
  const comparisonAnalysis = comparisonAnalysisInput.value

  // Construct the parsed query objects
  const comparisonVariant: CL.RegionalAnalysisVariant = useVariant(
    comparisonAnalysis,
    parseInt(query.comparisonCutoff, 10),
    parseInt(query.comparisonPercentile, 10),
    query.comparisonPointSetId
  )

  const grid = useRegionalAnalysisGrid(analysisVariant)
  const comparisonGrid = useRegionalAnalysisGrid(comparisonVariant)
  const displayGrid = useDisplayGrid(grid, comparisonGrid)
  const displayScale = useDisplayScale(displayGrid)

  /**
   * Display results?
   * When an originPointSetKey is set, we cannot display the map in the application and can only offer the
   * ability to download the data that has been created for manual inspection.
   */
  const displayResults = analysis.request?.originPointSetKey == null

  return (
    <>
      <RegionalHeading
        analysis={analysis}
        remove={() => regionalAnalysisCollection.remove(analysis._id)}
        update={(updates: Partial<CL.RegionalAnalysis>) =>
          regionalAnalysisCollection.update(analysis._id, updates)
        }
      />

      <VariantSelectors
        analysisVariant={analysisVariant}
        onChangeCutoff={(v) => routeTo({cutoff: v})}
        onChangePercentile={(v) => routeTo({percentile: v})}
        onChangePointSet={(v) => routeTo({destinationPointSetId: v})}
      />

      <DownloadMenu analysisVariant={analysisVariant} />

      <RequestDisplay analysis={analysis} />

      {displayResults && (
        <>
          <AccessMap grid={displayGrid} displayScale={displayScale} />

          <Legend
            analysisVariant={analysisVariant}
            comparisonVariant={comparisonVariant}
            displayGrid={displayGrid}
            displayScale={displayScale}
          />

          <FormControl px={4}>
            <FormLabel htmlFor={comparisonAnalysisInput.id}>
              {message('analysis.compareTo')}
            </FormLabel>
            <Select
              inputId={comparisonAnalysisInput.id}
              isClearable
              getOptionLabel={getName}
              getOptionValue={getId}
              onChange={comparisonAnalysisInput.onChange}
              options={comparisonAnalyses}
              value={comparisonAnalysis}
            />
          </FormControl>

          {comparisonAnalysis && (
            <>
              {analysis.workerVersion !== comparisonAnalysis.workerVersion && (
                <Alert status='error'>
                  <AlertIcon />
                  {message('r5Version.comparisonIsDifferent')}
                </Alert>
              )}

              <VariantSelectors
                analysisVariant={comparisonVariant}
                onChangeCutoff={(v) => routeTo({comparisonCutoff: v})}
                onChangePercentile={(v) => routeTo({comparisonPercentile: v})}
                onChangePointSet={(v) =>
                  routeTo({comparisonDestinationPointSetId: v})
                }
              />

              <RequestDisplay analysis={comparisonAnalysis} color='red' />
            </>
          )}

          <AggregationAreas
            aggregationAreaId={query.aggregationAreaId}
            regionId={analysis.regionId}
          />
        </>
      )}
    </>
  )
}
