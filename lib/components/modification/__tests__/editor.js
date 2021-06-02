import {testComponentMount} from 'lib/utils/component'
import {mockModification} from 'lib/utils/mock-data'

import Editor from '../editor'

const createProps = (mod) => ({
  allVariants: ['variant one', 'variant two'],
  clearActive: jest.fn(),
  copyModification: jest.fn(),
  feedIsLoaded: true,
  modification: mod,
  modificationId: mod._id,
  query: {
    projectId: mod.projectId,
    regionId: '1'
  },
  removeModification: jest.fn(),
  saveInProgress: false,
  setActive: jest.fn(),
  update: jest.fn(),
  updateAndRetrieveFeedData: jest.fn(),
  updateLocally: jest.fn()
})

testComponentMount(
  Editor,
  createProps({...mockModification, description: undefined})
)
