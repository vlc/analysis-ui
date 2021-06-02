import {FormControl, FormLabel, Stack} from '@chakra-ui/react'
import fpGet from 'lodash/fp/get'
import {useState} from 'react'

import message from 'lib/message'

import Select from 'lib/components/select'
import {useShallowRouteTo} from 'lib/hooks/use-route-to'

// Getters for react-select
const getName = fpGet('name')
const getId = fpGet('_id')

export default function AggregationArea(p: {
  activeAggregationArea?: CL.AggregationArea
  aggregationAreas: CL.AggregationArea[]
  regionId: string
}) {
  const routeTo = useShallowRouteTo('regionalAnalysis')
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
    <Stack spacing={4} p={4}>
      <FormControl>
        <FormLabel>{message('analysis.aggregateTo')}</FormLabel>
        <Select
          isClearable
          isLoading={isLoading}
          name='aggregateTo'
          getOptionLabel={getName}
          getOptionValue={getId}
          options={p.aggregationAreas}
          value={p.activeAggregationArea}
          onChange={setActive}
        />
      </FormControl>
    </Stack>
  )
}
