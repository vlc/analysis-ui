import {FormControl, FormLabel} from '@chakra-ui/react'
import fpGet from 'lodash/fp/get'
import dynamic from 'next/dynamic'
import {useCallback} from 'react'

import Regional from 'lib/components/analysis/regional'
import RegionalComparisonDisplay from 'lib/components/analysis/regional-comparison-display'
import Select from 'lib/components/select'
import {UseCollectionResponse} from 'lib/hooks/use-collection'
import useControlledInput from 'lib/hooks/use-controlled-input'
import {useShallowRouteTo} from 'lib/hooks/use-route-to'
import message from 'lib/message'

import RequestDisplay from './request'

const RegionalResults = dynamic(
  () => import('lib/components/analysis/regional-results'),
  {
    ssr: false
  }
)

const getId = fpGet('_id')
const getName = fpGet('name')

/**
 * Don't compare incomparable analyses.
 */
function getComparisonAnalyses(
  allAnalyses: CL.RegionalAnalysis[],
  activeJobs: CL.RegionalJob[],
  analysis: CL.RegionalAnalysis
) {
  return allAnalyses.filter(
    (c) =>
      activeJobs.findIndex((job) => job.jobId === c._id) === -1 &&
      c.request.originPointSetKey == null &&
      c.zoom === analysis.zoom &&
      c.width === analysis.width &&
      c.height === analysis.height &&
      c.north === analysis.north &&
      c.west === analysis.west
  )
}

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
  const goToComparison = useShallowRouteTo('regionalAnalyses', {
    regionId,
    analysisId
  })
  const onChangeComparisonAnalysis = useCallback(
    (v) => goToComparison({comparisonAnalysisId: v?._id}),
    [goToComparison]
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
      <Regional
        analysis={analysis}
        job={activeJob}
        key={analysis._id}
        remove={() => regionalAnalysisCollection.remove(analysis._id)}
        update={(updates: Partial<CL.RegionalAnalysis>) =>
          regionalAnalysisCollection.update(analysis._id, updates)
        }
      />

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
              options={getComparisonAnalyses(allAnalyses, jobs, analysis)}
              value={comparisonAnalysis}
            />
          </FormControl>

          {comparisonAnalysis && (
            <>
              <RegionalComparisonDisplay
                analysis={analysis}
                comparisonAnalysis={comparisonAnalysis}
              />

              <RequestDisplay analysis={comparisonAnalysis} color='red' />
            </>
          )}

          <RegionalResults
            comparisonAnalysis={comparisonAnalysis}
            analysis={analysis}
            key={analysis._id}
          />
        </>
      )}
    </>
  )
}
