import {
  Alert,
  AlertIcon,
  Box,
  Heading,
  Stack,
  Text,
  useColorModeValue
} from '@chakra-ui/react'
import MapControl from 'react-leaflet-control'

import {format} from 'd3-format'
import reverse from 'lodash/reverse'

import {isLight} from 'lib/utils/rgb-color-contrast'

import {getAccessibilityLabel} from '../utils'

const textFormat = format(',.0f')

/**
 * Render a regional analysis legend.
 */
export default function RegionalLegend({
  analysisVariant,
  comparisonVariant,
  displayGrid,
  displayScale
}: {
  analysisVariant: CL.RegionalAnalysisVariant
  comparisonVariant?: CL.RegionalAnalysisVariant
  displayGrid: CL.RegionalGrid
  displayScale: CL.RegionalDisplayScale
}) {
  const legendBackround = useColorModeValue('white', 'gray.900')
  const accessToLabel = getAccessibilityLabel(analysisVariant, [])
  const comparisonAccessToLabel =
    comparisonVariant && getAccessibilityLabel(comparisonVariant, [])

  return (
    <MapControl position='bottomleft'>
      <Stack
        bg={legendBackround}
        boxShadow='lg'
        rounded='md'
        spacing={3}
        width='296px'
      >
        <Heading pt={4} px={4} size='sm'>
          Access to
        </Heading>

        <Box px={4}>
          <Heading size='xs'>{analysisVariant.analysis.name}</Heading>
          <Text>{accessToLabel}</Text>
        </Box>

        {comparisonAccessToLabel && (
          <Box px={4}>
            <Text color='red.500'>
              <em>minus</em>
            </Text>
            <Heading size='xs'>{comparisonVariant.analysis.name}</Heading>
            <Text>{comparisonAccessToLabel}</Text>
          </Box>
        )}

        {displayGrid && displayScale ? (
          displayScale.error ? (
            <Alert roundedBottom='md' status='warning'>
              <AlertIcon />
              Data not suitable for generating a color scale.
            </Alert>
          ) : displayScale.breaks.length === 0 ? (
            <Alert roundedBottom='md' status='warning'>
              <AlertIcon />
              There is no data to show.
            </Alert>
          ) : (
            <LegendColors
              breaks={displayScale.breaks}
              min={displayGrid.min}
              colors={displayScale.colorRange}
            />
          )
        ) : (
          <Text p={4}>Loading grids...</Text>
        )}
      </Stack>
    </MapControl>
  )
}

/**
 * Show the banded colors for a regional analysis
 */
function LegendColors({
  breaks,
  colors,
  min
}: {
  breaks: number[]
  colors: any
  min: number
}) {
  const formatText = (i: number) => {
    const bottom = i === 0 && min <= breaks[0] ? min : breaks[i - 1]
    const top = breaks[i]
    const text =
      bottom === top ? bottom : `${textFormat(top)} to ${textFormat(bottom)}`
    if (colors[i].opacity === 0) return `${text} (transparent)`
    return text
  }
  const breakProps = breaks.map((_, i: number) => ({
    backgroundColor: `rgba(${colors[i].r}, ${colors[i].g}, ${colors[i].b}, 1)`,
    color: isLight(colors[i]) ? '#000' : '#fff',
    children: formatText(i)
  }))

  return (
    <Stack borderTopWidth='1px' spacing={0}>
      {reverse(breakProps).map((props, i) => (
        <Box
          _last={{
            roundedBottom: 'md'
          }}
          px={4}
          py={1}
          key={`break-${i}`}
          {...props}
        />
      ))}
    </Stack>
  )
}
