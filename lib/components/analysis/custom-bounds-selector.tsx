import {Button, Flex, FormControl, FormLabel} from '@chakra-ui/react'
import lonlat from '@conveyal/lonlat'
import dynamic from 'next/dynamic'
import {useEffect, useState} from 'react'

import {EditIcon, XIcon} from 'lib/components/icons'
import message from 'lib/message'

import Select from '../select'

const EditBounds = dynamic(() => import('../map/edit-bounds'), {ssr: false})

type Option = {
  label: string
  value: string
  disabled?: boolean
}

/**
 * Options available are:
 * 1. Bounds of the region
 * 2. Previously run analysis bounds that are different than the regions.
 * 3. Creating a "Custom Boundary"
 */
export default function CustomBoundsSelector({
  isDisabled,
  profileRequest,
  regionBounds,
  regionalAnalyses,
  updateProfileRequest
}: {
  isDisabled: boolean
  profileRequest: CL.ProfileRequest
  regionBounds: CL.Bounds
  regionalAnalyses: CL.RegionalAnalysis[]
  updateProfileRequest: (pr: Partial<CL.ProfileRequest>) => void
}) {
  const [editingBounds, setEditingBounds] = useState(false)
  const [options, setOptions] = useState<Option[]>([])
  const [selected, setSelected] = useState<string>('__REGION')
  const {bounds} = profileRequest

  useEffect(() => {
    let newSelected = '__REGION'
    if (bounds && !boundsEqual(bounds, regionBounds)) {
      const selectedAnalysis = regionalAnalyses.find((r) =>
        boundsEqual(webMercatorBoundsToGeographic(r), bounds)
      )

      if (selectedAnalysis != null) newSelected = selectedAnalysis._id
      else newSelected = '__CUSTOM'
    }

    const newOptions: Option[] = [
      {value: '__REGION', label: message('analysis.regionalBoundsRegion')},
      ...regionalAnalyses
        .filter(
          (r) => !boundsEqual(webMercatorBoundsToGeographic(r), regionBounds)
        )
        .map(({name, _id}) => ({
          value: _id,
          label: message('analysis.regionalBoundsSame', {name})
        }))
    ]

    if (newSelected === '__CUSTOM') {
      // Don't allow the user to select 'Custom' - to make custom bounds, just drag the map markers
      newOptions.push({
        value: '__CUSTOM',
        label: message('analysis.regionalBoundsCustom'),
        disabled: true
      })
    }

    setSelected(newSelected)
    setOptions(newOptions)
  }, [bounds, regionBounds, regionalAnalyses])

  function _setRegionalAnalysisBounds(e: Option) {
    if (e.value === '__REGION') {
      updateProfileRequest({bounds: regionBounds})
    } else if (regionalAnalyses) {
      const foundAnalyses = regionalAnalyses.find((r) => r._id === e.value)
      if (foundAnalyses) {
        updateProfileRequest({
          bounds: webMercatorBoundsToGeographic(foundAnalyses)
        })
      }
    }
  }

  return (
    <FormControl isDisabled={isDisabled}>
      {editingBounds && (
        <EditBounds
          bounds={profileRequest.bounds}
          save={(bounds: CL.Bounds) => updateProfileRequest({bounds})}
        />
      )}
      <Flex justifyContent='space-between'>
        <FormLabel htmlFor='customBoundsSelect' whiteSpace='nowrap'>
          {message('analysis.regionalBounds')}
        </FormLabel>
        {editingBounds ? (
          <Button
            onClick={(e) => {
              e.preventDefault()
              setEditingBounds(false)
            }}
            rightIcon={<XIcon />}
            size='xs'
            colorScheme='yellow'
          >
            Stop editing
          </Button>
        ) : (
          <Button
            isDisabled={isDisabled}
            onClick={(e) => {
              e.preventDefault()
              setEditingBounds(true)
            }}
            rightIcon={<EditIcon />}
            size='xs'
            colorScheme='yellow'
          >
            Set custom
          </Button>
        )}
      </Flex>
      <div>
        <Select
          inputId='customBoundsSelect'
          isDisabled={isDisabled}
          value={options.find((o) => o.value === selected)}
          options={options}
          onChange={_setRegionalAnalysisBounds}
        />
      </div>
    </FormControl>
  )
}

function boundsEqual(b0: CL.Bounds, b1: CL.Bounds, epsilon = 1e-6) {
  return (
    Math.abs(b0.north - b1.north) < epsilon &&
    Math.abs(b0.west - b1.west) < epsilon &&
    Math.abs(b0.east - b1.east) < epsilon &&
    Math.abs(b0.south - b1.south) < epsilon
  )
}

/**
 * Convert web mercator bounds from a regional analysis to geographic bounds.
 */
function webMercatorBoundsToGeographic(
  regionalAnalysis: CL.RegionalAnalysis
): CL.Bounds {
  const nw = lonlat.fromPixel(
    {
      x: regionalAnalysis.west + 1,
      y: regionalAnalysis.north
    },
    regionalAnalysis.zoom
  )
  const se = lonlat.fromPixel(
    {
      x: regionalAnalysis.west + regionalAnalysis.width + 1,
      y: regionalAnalysis.north + regionalAnalysis.height
    },
    regionalAnalysis.zoom
  )
  return {
    east: se.lon,
    north: nw.lat,
    south: se.lat,
    west: nw.lon
  }
}
