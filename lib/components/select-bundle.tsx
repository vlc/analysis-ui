import {FormControl, FormLabel} from '@chakra-ui/react'
import get from 'lodash/fp/get'
import {useState} from 'react'

import useRouteTo from 'lib/hooks/use-route-to'
import message from 'lib/message'

import Combobox from './combobox'

const getOptionLabel = (b: CL.Bundle) => b.name

export default function SelectBundle({
  bundles,
  query
}: {
  bundles: CL.Bundle[]
  query: Record<string, string>
}) {
  const [bundleId, setBundleId] = useState(query.bundleId)
  const goToBundleEdit = useRouteTo('bundle', {regionId: query.regionId})

  function selectBundle(result: CL.Bundle) {
    setBundleId(result._id)
    goToBundleEdit({bundleId: result._id})
  }

  return (
    <FormControl>
      <FormLabel htmlFor='selectBundle' textAlign='center'>
        {message('bundle.select')}
      </FormLabel>
      <div>
        <Combobox<CL.Bundle>
          getOptionLabel={getOptionLabel}
          getOptionValue={get('_id')}
          onChange={selectBundle}
          options={bundles}
          placeholder='Select a bundle'
          value={bundles.find((b) => b._id === bundleId)}
        />
      </div>
    </FormControl>
  )
}
