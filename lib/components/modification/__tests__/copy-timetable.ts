import {testComponent} from 'lib/utils/component'
import {mockModification} from 'lib/utils/mock-data'
import CopyTimetable from '../copy-timetable'

function timeoutPromise() {
  return new Promise((resolve) => {
    setTimeout(resolve, 5)
  })
}

describe('Component > Modification > CopyTimetable', () => {
  it('renders correctly', async () => {
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

  // if rendering a region without any timetables, show the first
  // timetable that is available
  it('renders with a region without timetables', async () => {
    const wrapper = testComponent(CopyTimetable, {
      create: jest.fn(),
      intoModification: mockModification
    }).mount()

    // wait for load to finish
    await timeoutPromise()

    // snapshot loaded state
    expect(wrapper).toMatchSnapshot()

    wrapper.unmount()
  })

  // a test case for when no timetables are available to copy
  it('renders when no timetables exist in database', async () => {
    const wrapper = testComponent(CopyTimetable, {
      create: jest.fn(),
      intoModification: mockModification
    }).mount()

    // Wait for load to finish
    await timeoutPromise()

    // snapshot loaded state
    expect(wrapper).toMatchSnapshot()

    // unmount
    wrapper.unmount()
  })
})
