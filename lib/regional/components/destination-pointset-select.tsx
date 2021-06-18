import {Select} from '@chakra-ui/react'

import Tip from 'lib/components/tip'
import useControlledInput from 'lib/hooks/use-controlled-input'

import {useDestinationPointSets} from '../destination-pointsets'

// Get full qualifier for spatial datasets
const getFullName = (od: CL.SpatialDataset) => `${od?.sourceName}: ${od?.name}`

export default function DestinationPointsetSelect({
  analysis,
  onChange,
  value
}: {
  analysis: CL.RegionalAnalysis
  onChange: (id: string) => void
  value: string
}) {
  const input = useControlledInput({onChange, value})
  const spatialDatasets = useDestinationPointSets(analysis)

  return (
    <Tip label='Destination point set'>
      <Select {...input}>
        {spatialDatasets.map((sd) => (
          <option key={sd._id} value={sd._id}>
            {getFullName(sd)}
          </option>
        ))}
      </Select>
    </Tip>
  )
}
