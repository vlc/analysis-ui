import {testAndSnapshot} from 'lib/utils/component'

import SelectPatterns from '../select-patterns'

testAndSnapshot(SelectPatterns, {
  onChange: jest.fn(),
  trips: null
})
