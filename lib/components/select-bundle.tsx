import {FormControl, FormLabel} from '@chakra-ui/react'
import {useState} from 'react'

import useRouteTo from 'lib/hooks/use-route-to'
import message from 'lib/message'

import Combobox from './combobox'

export default function SelectBundle({
  bundles,
  query
}: {
  bundles: CL.Bundle[]
  query: CL.Query
}) {
  const [bundleId, setBundleId] = useState(query.bundleId)
  const goToBundleEdit = useRouteTo('bundle', {regionId: query.regionId})
  return (
    <FormControl>
      <FormLabel htmlFor='selectBundle' textAlign='center'>
        {message('bundle.select')}
      </FormLabel>
      <div>
        <Combobox<CL.Bundle>
          onChange={(result: CL.Bundle) => {
            setBundleId(result._id)
            goToBundleEdit({bundleId: result._id})
          }}
          options={bundles || []}
          placeholder='Select an existing bundle'
          value={bundles?.find((b) => b._id === bundleId)}
        />
      </div>
    </FormControl>
  )
}
