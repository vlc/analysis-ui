import {useState, useEffect} from 'react'
import {GeoJSON, GeoJSONProps} from 'react-leaflet'

let keyIndex = 0
const nextKey = () => keyIndex++

/**
 * Increment the render count when the data or style changes to replace the entire underlying GeoJSON component.
 */
export default function KeyedGeoJSON({data, style, ...p}: GeoJSONProps) {
  const [key, setKey] = useState(() => nextKey())
  useEffect(() => setKey(nextKey()), [data, style])
  return <GeoJSON data={data || []} key={key} style={style} {...p} />
}
