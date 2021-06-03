import nock from 'nock'

import {testComponent} from 'lib/utils/component'
import {mockModification} from 'lib/utils/mock-data'
import CopyTimetable from '../copy-timetable'

describe('Component > Modification > CopyTimetable', () => {
  it('renders correctly', async () => {
    nock('https://localhost').get('/api/timetables').reply(200, [])

    const create = jest.fn()
    const wrapper = testComponent(CopyTimetable, {
      create,
      intoModification: mockModification
    }).mount()

    // Snapshot the loaded state
    expect(wrapper).toMatchSnapshot()

    // Click the button
    wrapper.find('Button').simulate('click')

    // Modal should be open
    expect(wrapper).toMatchSnapshot()

    // Unmount wihtout errors
    wrapper.unmount()
  })
})
