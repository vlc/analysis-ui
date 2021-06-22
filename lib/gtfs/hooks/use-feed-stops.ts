import useBundleStops from './use-bundle-stops'

export default function useStops(
  bundleId: string,
  feedId: string
): GTFS.Stop[] {
  const bundleStops = useBundleStops(bundleId)
  return bundleStops.find((b) => b.feedId === feedId)?.stops ?? []
}
