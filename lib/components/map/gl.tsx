import {useContext, useEffect} from 'react'
import ReactMapGL, {MapContext, WebMercatorViewport} from 'react-map-gl'

import 'mapbox-gl/dist/mapbox-gl.css'

import {MB_TOKEN} from 'lib/constants'
import useWindowSize from 'lib/hooks/use-window-size'
import {Map} from 'mapbox-gl'

const defaultStyle =
  process.env.NEXT_PUBLIC_MAPBOX_STYLE || 'conveyal/cjwu7oipd0bf41cqqv15huoim'
const toStyleURL = (style: string) => `mapbox://styles/${style}`

export default function GLMap({height, width}) {
  const {map, setMap, setViewport, viewport} = useContext<any>(MapContext)
  const windowSize = useWindowSize()
  useEffect(() => {
    setViewport(
      (v: WebMercatorViewport) => new WebMercatorViewport({...v, height, width})
    )
    if (map) {
      ;(map as Map).resize()
    }
  }, [map, height, setViewport, width, windowSize])

  return (
    <ReactMapGL
      {...viewport}
      mapboxApiAccessToken={MB_TOKEN}
      mapStyle={toStyleURL(defaultStyle)}
      onViewportChange={(v: any) => setViewport(new WebMercatorViewport(v))}
      ref={(ref) => ref && setMap(ref.getMap())}
      reuseMaps
    />
  )
}
