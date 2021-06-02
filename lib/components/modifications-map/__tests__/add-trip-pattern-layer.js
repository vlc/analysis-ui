import {testComponentMount} from 'lib/utils/component'
import {mockSegment} from 'lib/utils/mock-data'

import AddTripPatternLayer from '../add-trip-pattern-layer'

const props = {
  bidirectional: false,
  segments: [mockSegment]
}

testComponentMount(AddTripPatternLayer, props)
