import dynamic from 'next/dynamic'

import ActiveJob from './active-job'
import RequestDisplay from './request'

const AnalysisBounds = dynamic(() => import('./analysis-bounds'), {ssr: false})

/**
 * View an active or completed regional analysis.
 */
export default function ActiveAnalysisPage({
  analysis,
  activeJob
}: {
  analysis: CL.RegionalAnalysis
  activeJob: CL.RegionalJob
}) {
  return (
    <>
      <AnalysisBounds analysis={analysis} />

      <ActiveJob job={activeJob} />

      <RequestDisplay analysis={analysis} />
    </>
  )
}
