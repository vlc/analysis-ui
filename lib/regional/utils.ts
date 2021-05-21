function getDefaultCutoff(a: CL.RegionalAnalysis): number {
  if (Array.isArray(a.cutoffsMinutes))
    return a.cutoffsMinutes[Math.floor(a.cutoffsMinutes.length / 2)]
  return a.cutoffMinutes
}

function getDefaultDestinationPointSet(a: CL.RegionalAnalysis): string | void {
  const ids = a.destinationPointSetIds
  if (Array.isArray(ids)) return ids[0]
}

function getDefaultPercentile(a: CL.RegionalAnalysis): number {
  if (Array.isArray(a.travelTimePercentiles))
    return a.travelTimePercentiles[
      Math.floor(a.travelTimePercentiles.length / 2)
    ]
  return a.travelTimePercentile
}

/**
 * Choose
 */
export function getDefaultVariants(analysis: CL.RegionalAnalysis) {
  return {
    cutoff: getDefaultCutoff(analysis),
    destinationPointSetId: getDefaultDestinationPointSet(analysis),
    percentile: getDefaultPercentile(analysis)
  }
}

export function getComparisonVariants(comparison: CL.RegionalAnalysis) {
  return {
    comparisonCutoff: getDefaultCutoff(comparison),
    comparisonDestinationPointSetId: getDefaultDestinationPointSet(comparison),
    comparisonPercentile: getDefaultPercentile(comparison)
  }
}

/**
 * Don't compare incomparable analyses.
 */
export function getValidComparisonAnalyses(
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
