import {testAndSnapshot} from 'lib/utils/component'

import SelectFeedAndRoutes from '../select-feed-and-routes'

testAndSnapshot(SelectFeedAndRoutes, {
  onChange: jest.fn()
})
