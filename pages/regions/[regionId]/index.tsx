import {Alert} from '@chakra-ui/core'
import {useRouter} from 'next/router'
import {GeolocateControl} from 'react-map-gl'

import FullSpinner from 'lib/components/full-spinner'
import SelectProject from 'lib/components/select-project'
import {useRegion} from 'lib/hooks/use-model'
import MapLayout from 'lib/layouts/gl-map'

const geolocateControlStyle = {
  right: 10,
  top: 10
}

function SelectProjectPage() {
  const router = useRouter()
  const {data: region, error} = useRegion(router.query.regionId as string)
  if (error) return <Alert status='error'>{error.message}</Alert>
  if (!region) return <FullSpinner />
  return (
    <>
      <SelectProject region={region} />
      <GeolocateControl
        auto
        positionOptions={{enableHighAccuracy: true}}
        style={geolocateControlStyle}
        trackUserLocation={true}
      />
    </>
  )
}

SelectProjectPage.Layout = MapLayout

export default SelectProjectPage
