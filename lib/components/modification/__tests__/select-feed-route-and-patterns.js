import {testAndSnapshot} from 'lib/utils/component'
import {mockFeed, mockRoute} from 'lib/utils/mock-data'

import SelectFeedRouteAndPatterns from '../select-feed-route-and-patterns'

testAndSnapshot(SelectFeedRouteAndPatterns, {
  feeds: [mockFeed],
  onChange: jest.fn(),
  routes: [mockRoute],
  trips: []
})
