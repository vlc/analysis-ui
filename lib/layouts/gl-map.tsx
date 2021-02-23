import {Box, Flex} from '@chakra-ui/core'
import {useState} from 'react'
import {MapContext, WebMercatorViewport} from 'react-map-gl'
import {AutoSizer} from 'react-virtualized'

import Map from 'lib/components/map/gl'
import Sidebar from 'lib/components/sidebar'
import useRouteChanging from 'lib/hooks/use-route-changing'
import withAuth from 'lib/with-auth'
import withRedux from 'lib/with-redux'

/**
 * Components are rendered this way so that the map does not get unmounted
 * and remounted on each page change. There is probably a better way to do this
 * but I have not figured out a better solution yet.
 */
export default withAuth(
  withRedux(function MapLayout(p) {
    const [routeChanging] = useRouteChanging()
    const [viewport, setViewport] = useState<Partial<WebMercatorViewport>>(
      new WebMercatorViewport({
        height: 100,
        latitude: 37.7577,
        longitude: -122.4376,
        width: 100,
        zoom: 8
      })
    )
    const context: any = {setViewport, viewport}

    return (
      <MapContext.Provider value={context}>
        <Flex pointerEvents={routeChanging ? 'none' : 'inherit'}>
          <style jsx global>{`
            body {
              height: 100vh;
              overflow: hidden;
              width: 100vw;
            }
          `}</style>
          <Sidebar />
          <Box
            borderRight='1px solid #ddd'
            bg='#fff'
            opacity={routeChanging ? 0.4 : 1}
            minWidth='321px'
          >
            {p.children}
          </Box>
          <Box
            flexGrow={1}
            opacity={routeChanging ? 0.4 : 1}
            position='relative'
          >
            <AutoSizer>
              {({height, width}) => <Map height={height} width={width} />}
            </AutoSizer>
          </Box>
        </Flex>
      </MapContext.Provider>
    )
  })
)
