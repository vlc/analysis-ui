import lonlat from '@conveyal/lonlat'
import {LatLngBoundsLiteral} from 'leaflet'
import {Rectangle} from 'react-leaflet'

/**
 * Unproject the analysis bounds into `Leaflet.LatLng` points to be used for a
 * rectangle. NB code was copied from another location that also incremented
 * `west` by 1. Possibly to ensure non-zero numbers.
 */
function getAnalysisBounds(analysis: CL.RegionalAnalysis): LatLngBoundsLiteral {
  const {north, west, width, height, zoom} = analysis
  const nw = lonlat.fromPixel({x: west + 1, y: north}, zoom)
  const se = lonlat.fromPixel({x: west + width + 1, y: north + height}, zoom)
  return [
    [nw.lat, nw.lon],
    [se.lat, se.lon]
  ]
}

export default function AnalysisBounds(p: {analysis: CL.RegionalAnalysis}) {
  return <Rectangle bounds={getAnalysisBounds(p.analysis)} weight={2} />
}
