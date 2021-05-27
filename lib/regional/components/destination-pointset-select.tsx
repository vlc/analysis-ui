import {Select} from '@chakra-ui/react'

import useControlledInput from 'lib/hooks/use-controlled-input'
import {useSpatialDatasets} from 'lib/hooks/use-collection'

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
  const {data: spatialDatasets} = useSpatialDatasets({
    query: {
      _id: {$in: analysis.destinationPointSetIds}
    },
    options: {
      projection: {
        name: 1,
        sourceName: 1
      }
    }
  })

  return (
    <Select {...input}>
      {spatialDatasets.map((sd) => (
        <option key={sd._id} value={sd._id}>
          {getFullName(sd)}
        </option>
      ))}
    </Select>
  )
}
