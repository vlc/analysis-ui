import {Alert, AlertIcon, FormControl, FormLabel} from '@chakra-ui/react'
import fpGet from 'lodash/fp/get'
import dynamic from 'next/dynamic'
import {useCallback} from 'react'

import Select from 'lib/components/select'
import {UseCollectionResponse} from 'lib/hooks/use-collection'
import useControlledInput from 'lib/hooks/use-controlled-input'
import {useShallowRouteTo} from 'lib/hooks/use-route-to'
import message from 'lib/message'

import AggregationAreaUpload from './aggregation-area'
import Aggregation from './aggregation'
import ActiveJob from './active-job'
import DownloadMenu from './download-menu'
import RegionalHeading from './heading'
import RequestDisplay from './request'
import {getComparisonVariants, getValidComparisonAnalyses} from './utils'
import VariantSelectors from './variant-selectors'

const AggregationArea = dynamic(
  () => import('lib/components/map/aggregation-area'),
  {
    ssr: false
  }
)
const AnalysisBounds = dynamic(
  () => import('lib/components/map/analysis-bounds'),
  {
    ssr: false
  }
)
const DotMap = dynamic(
  () => import('lib/modules/opportunity-datasets/components/dotmap'),
  {ssr: false}
)
const RegionalLayer = dynamic(() => import('lib/components/map/regional'), {
  ssr: false
})
const RegionalLegend = dynamic(() => import('./legend'))

const getId = fpGet('_id')
const getName = fpGet('name')

/**
 * View an active or completed regional analysis.
 */
export default function ResultsPage({
  analysis,
  jobs,
  query,
  regionalAnalysisCollection
}: {
  analysis: CL.RegionalAnalysis
  jobs: CL.RegionalJob[]
  query: CL.Query
  regionalAnalysisCollection: UseCollectionResponse<CL.RegionalAnalysis>
}) {
  const allAnalyses = regionalAnalysisCollection.data
  const {analysisId, comparisonAnalysisId, regionId} = query
  const routeTo = useShallowRouteTo('regionalAnalyses', {
    analysisId,
    regionId,
    comparisonAnalysisId
  })
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
    value: allAnalyses.find((a) => a._id === comparisonAnalysisId)
  })
  const comparisonAnalysis = comparisonAnalysisInput.value
  const activeJob = jobs.find((j) => j.jobId === analysis._id)

  /**
   * Show results?
   * When an originPointSetKey is set, we cannot display the in the application and can only offer the
   * ability to download the data that has been created for manual inspection.
   */
  const showResults = activeJob == null && analysis.request?.originPointSetKey

  return (
    <>
      {!showResults ? (
        <AnalysisBounds analysis={analysis} />
      ) : (
        <>
          <RegionalLegend
            analysis={analysis}
            comparisonAnalysis={comparisonAnalysis}
          />
          <DotMap />
          <RegionalLayer />
          <AggregationArea />
        </>
      )}

      <RegionalHeading
        analysis={analysis}
        remove={() => regionalAnalysisCollection.remove(analysis._id)}
        update={(updates: Partial<CL.RegionalAnalysis>) =>
          regionalAnalysisCollection.update(analysis._id, updates)
        }
      />

      {activeJob && <ActiveJob job={activeJob} />}

      <VariantSelectors
        analysis={analysis}
        cutoff={query.cutoff}
        percentile={query.percentile}
        pointSetId={query.destinationPointSetId}
        onChangeCutoff={(v) => routeTo({cutoff: v})}
        onChangePercentile={(v) => routeTo({percentile: v})}
        onChangePointSet={(v) => routeTo({destinationPointSetId: v})}
      />

      {showResults && (
        <DownloadMenu
          analysis={analysis}
          cutoff={query.cutoff}
          percentile={query.percentile}
          pointSetId={query.destinationPointSetId}
        />
      )}

      <RequestDisplay analysis={analysis} />

      {showResults && (
        <>
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
              options={getValidComparisonAnalyses(allAnalyses, jobs, analysis)}
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
                analysis={comparisonAnalysis}
                cutoff={query.comparisonCutoff}
                percentile={query.comparisonPercentile}
                pointSetId={query.pointSetId}
                onChangeCutoff={(v) => routeTo({comparisonCutoff: v})}
                onChangePercentile={(v) => routeTo({comparisonPercentile: v})}
                onChangePointSet={(v) =>
                  routeTo({comparisonDestinationPointSetId: v})
                }
              />
              <RequestDisplay analysis={comparisonAnalysis} color='red' />
            </>
          )}

          <AggregationAreaUpload regionId={regionId} />

          <Aggregation
            comparisonAnalysis={comparisonAnalysis}
            analysis={analysis}
          />
        </>
      )}
    </>
  )
}
