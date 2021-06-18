import {useMemo} from 'react'

import message from 'lib/message'

const getCutoffs = (a: CL.RegionalAnalysis): number[] =>
  Array.isArray(a.cutoffsMinutes) ? a.cutoffsMinutes : [a.cutoffMinutes]
const getPercentiles = (a: CL.RegionalAnalysis): number[] =>
  Array.isArray(a.travelTimePercentiles)
    ? a.travelTimePercentiles
    : [a.travelTimePercentile]

function getDefaultCutoff(a: CL.RegionalAnalysis): number {
  const cutoffs = getCutoffs(a)
  return cutoffs[Math.floor(cutoffs.length / 2)]
}

function getDefaultDestinationPointSet(a: CL.RegionalAnalysis): string {
  const ids = a.destinationPointSetIds
  if (Array.isArray(ids)) return ids[0]
  return ''
}

function getDefaultPercentile(a: CL.RegionalAnalysis): number {
  const percentiles = getPercentiles(a)
  return percentiles[Math.floor(percentiles.length / 2)]
}

/**
 * Hook for generating a regional analysis variant object.
 */
export function useVariant(
  analysis: CL.RegionalAnalysis,
  cutoff: number,
  percentile: number,
  pointSetId: string
) {
  return useMemo<CL.RegionalAnalysisVariant>(
    () => ({
      analysis,
      cutoff,
      percentile,
      pointSetId,
      get isValid() {
        return variantIsCompatible(this)
      }
    }),
    [analysis, cutoff, percentile, pointSetId]
  )
}

/**
 * Choose
 */
export function getDefaultVariants(analysis: CL.RegionalAnalysis) {
  return {
    cutoff: getDefaultCutoff(analysis),
    pointSetId: getDefaultDestinationPointSet(analysis),
    percentile: getDefaultPercentile(analysis)
  }
}

/**
 * 1. Use comparison values from query if they exist and they are compatible with the comparison analysis, or
 * 2. Use values from base analysis and they are compatible with the comparison analysis, or
 * 3. Use the default values compatible with the comparison analysis.
 */
export function getComparisonVariants(
  comparison: CL.RegionalAnalysis,
  query: CL.Query
) {
  const cutoffs = getCutoffs(comparison)
  const percentiles = getPercentiles(comparison)
  const pointSets = comparison.destinationPointSetIds ?? []

  let cutoff = getDefaultCutoff(comparison)
  if (cutoffs.indexOf(parseInt(query.comparisonCutoff)) > -1) {
    cutoff = parseInt(query.comparisonCutoff)
  } else if (cutoffs.indexOf(parseInt(query.cutoff)) > -1) {
    cutoff = parseInt(query.cutoff)
  }

  let percentile = getDefaultPercentile(comparison)
  if (percentiles.indexOf(parseInt(query.comparisonPercentile)) > -1) {
    percentile = parseInt(query.comparisonPercentile)
  } else if (percentiles.indexOf(parseInt(query.percentile)) > -1) {
    percentile = parseInt(query.percentile)
  }

  let pointSetId = getDefaultDestinationPointSet(comparison)
  if (pointSets.indexOf(query.comparisonPointSetId) > -1) {
    pointSetId = query.comparisonPointSetId
  } else if (pointSets.indexOf(query.pointSetId) > -1) {
    pointSetId = query.pointSetId
  }

  return {
    comparisonCutoff: cutoff,
    comparisonPointSetId: pointSetId,
    comparisonPercentile: percentile
  }
}

function getNumberWithOrdinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

/**
 * Get the label for a variant
 */
export function getAccessibilityLabel(
  variant: CL.RegionalAnalysisVariant,
  pointSets: CL.SpatialDataset[]
) {
  const analysis = variant?.analysis
  if (!analysis) return
  const pointSet = pointSets.find((p) => p._id === variant.pointSetId)
  const opportunity = pointSet?.name ?? variant.pointSetId
  if (Array.isArray(analysis.travelTimePercentiles)) {
    return message('analysis.accessTo', {
      opportunity,
      cutoff: variant.cutoff,
      percentile: getNumberWithOrdinal(variant.percentile)
    })
  }
  if (analysis.travelTimePercentile === -1) {
    return message('analysis.accessToInstantaneous', {
      opportunity,
      cutoff: analysis.cutoffMinutes
    })
  }
  return message('analysis.accessTo', {
    opportunity,
    cutoff: analysis.cutoffMinutes,
    percentile: getNumberWithOrdinal(analysis.travelTimePercentile)
  })
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

/**
 * Verify that the inputs are compatible with the regional analysis.
 * @param variant
 */
export function variantIsCompatible(
  variant: CL.RegionalAnalysisVariant
): boolean {
  const {analysis} = variant
  if (analysis == null) return false
  if (Array.isArray(analysis.cutoffsMinutes)) {
    if (analysis.cutoffsMinutes.indexOf(variant.cutoff) === -1) return false
  } else if (analysis.cutoffMinutes !== variant.cutoff) return false

  if (Array.isArray(analysis.travelTimePercentiles)) {
    if (analysis.travelTimePercentiles.indexOf(variant.percentile) === -1)
      return false
  } else if (analysis.travelTimePercentile !== variant.percentile) return false

  if (Array.isArray(analysis.destinationPointSetIds)) {
    if (analysis.destinationPointSetIds.indexOf(variant.pointSetId) === -1)
      return false
  }

  return true
}
