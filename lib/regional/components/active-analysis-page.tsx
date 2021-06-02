import dynamic from 'next/dynamic'

import {UseCollectionResponse} from 'lib/hooks/use-collection'
import {useShallowRouteTo} from 'lib/hooks/use-route-to'

import ActiveJob from './active-job'
import RegionalHeading from './heading'
import RequestDisplay from './request'
import VariantSelectors from './variant-selectors'

const AnalysisBounds = dynamic(() => import('./analysis-bounds'), {ssr: false})

/**
 * View an active or completed regional analysis.
 */
export default function ActiveAnalysisPage({
  analysisVariant,
  activeJob,
  regionalAnalysisCollection
}: {
  analysisVariant: CL.RegionalAnalysisVariant
  activeJob: CL.RegionalJob
  regionalAnalysisCollection: UseCollectionResponse<CL.RegionalAnalysis>
}) {
  const {analysis} = analysisVariant
  const routeTo = useShallowRouteTo('regionalAnalyses', {
    analysisId: analysis._id,
    regionId: analysis.regionId
  })

  return (
    <>
      <AnalysisBounds analysis={analysis} />

      <RegionalHeading
        analysis={analysis}
        remove={() => regionalAnalysisCollection.remove(analysis._id)}
        update={(updates: Partial<CL.RegionalAnalysis>) =>
          regionalAnalysisCollection.update(analysis._id, updates)
        }
      />

      <ActiveJob job={activeJob} />

      <VariantSelectors
        analysisVariant={analysisVariant}
        onChangeCutoff={(v) => routeTo({cutoff: v})}
        onChangePercentile={(v) => routeTo({percentile: v})}
        onChangePointSet={(v) => routeTo({pointSetId: v})}
      />

      <RequestDisplay analysis={analysis} />
    </>
  )
}
