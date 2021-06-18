import KeyedGeoJSON from 'lib/components/map/geojson'

import useAggregationAreaOutline from '../hooks/use-aggregation-area-outline'

/**
 * Fetch the aggregation area's grid and convert to GeoJSON.
 */
export default function AggregationAreaGeoJSONOutline(p: {
  aggregationArea: CL.AggregationArea
}) {
  return <KeyedGeoJSON data={useAggregationAreaOutline(p.aggregationArea)} />
}
