import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Stack,
  useDisclosure
} from '@chakra-ui/react'
import fpGet from 'lodash/fp/get'
import {useState} from 'react'

import {ChevronDown, ChevronUp} from 'lib/components/icons'
import {useAggregationAreas} from 'lib/hooks/use-collection'
import message from 'lib/message'
import OpportunityDatasets from 'lib/modules/opportunity-datasets'

import Select from 'lib/components/select'
import {useShallowRouteTo} from 'lib/hooks/use-route-to'

// import AggregateAccessibilityChart from './chart'
import CreateAggregationArea from './create'
import GeoJSONOutline from './geojson-outline'

// Getters for react-select
const getName = fpGet('name')
const getId = fpGet('_id')

export default function AggregationArea({
  aggregationAreaId,
  regionId
}: {
  aggregationAreaId?: string
  regionId: string
}) {
  const {data: aggregationAreas} = useAggregationAreas({
    query: {regionId}
  })
  const activeAggregationArea = aggregationAreas.find(
    (a) => a._id === aggregationAreaId
  )
  const routeTo = useShallowRouteTo('regionalAnalysis')
  const showUpload = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)

  async function setActive(aa: CL.AggregationArea) {
    if (aa) {
      setIsLoading(true)
      routeTo({aggregationAreaId: aa._id})
      setIsLoading(false)
    } else {
      routeTo({aggregationAreaId: null})
    }
  }

  return (
    <Stack spacing={4}>
      <FormControl>
        <FormLabel>{message('analysis.aggregateTo')}</FormLabel>
        <Select
          isClearable
          isLoading={isLoading}
          name='aggregateTo'
          getOptionLabel={getName}
          getOptionValue={getId}
          options={aggregationAreas}
          value={aggregationAreas.find(
            (aa) => aa._id === activeAggregationArea?._id
          )}
          onChange={setActive}
        />
      </FormControl>

      <Button
        isFullWidth
        leftIcon={showUpload.isOpen ? <ChevronUp /> : <ChevronDown />}
        onClick={showUpload.onToggle}
      >
        {showUpload.isOpen ? 'Hide' : message('analysis.newAggregationArea')}
      </Button>

      {showUpload.isOpen && (
        <Box>
          <CreateAggregationArea
            onClose={showUpload.onClose}
            regionId={regionId}
          />
        </Box>
      )}

      {activeAggregationArea && (
        <GeoJSONOutline aggregationArea={activeAggregationArea} />
      )}

      {activeAggregationArea && !isLoading && (
        <FormControl>
          <FormLabel>{message('analysis.weightBy')}</FormLabel>
          <OpportunityDatasets.components.Selector regionId={regionId} />
        </FormControl>
      )}

      {/*activeAggregationArea && (
        <Box px={4}>
          <AggregateAccessibilityChart
            aggregationArea={activeAggregationArea}
          />
        </Box>
      )*/}
    </Stack>
  )
}
