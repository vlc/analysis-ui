import dynamic from 'next/dynamic'
import React from 'react'

import {load} from 'lib/actions/region'
import {loadOpportunityDatasets} from 'lib/modules/opportunity-datasets/actions'
import Heading from 'lib/modules/opportunity-datasets/components/heading'
import List from 'lib/modules/opportunity-datasets/components/list'
import withInitialFetch from 'lib/with-initial-fetch'

const Dotmap = dynamic(
  import('lib/modules/opportunity-datasets/components/dotmap'),
  {ssr: false}
)

const Opportunities = React.memo(function Opportunities(p) {
  // Render into map
  const {setMapChildren} = p
  React.useEffect(() => {
    setMapChildren(() => <Dotmap />)
    return () => setMapChildren(() => <React.Fragment />)
  }, [setMapChildren])

  return (
    <Heading>
      <List {...p} />
    </Heading>
  )
})

function initialFetch(store, query) {
  return Promise.all([
    store.dispatch(loadOpportunityDatasets(query.regionId)),
    store.dispatch(load(query.regionId))
  ])
}

export default withInitialFetch(Opportunities, initialFetch)
