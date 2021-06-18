import {testAndSnapshot} from 'lib/utils/component'
import {mockModification} from 'lib/utils/mock-data'
import EditAlignment from '../edit-alignment'

const props = {
  disabled: false,
  modification: mockModification,
  numberOfStops: 16,
  update: jest.fn()
}

testAndSnapshot(EditAlignment, props)
