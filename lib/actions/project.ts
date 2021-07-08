import {stringify} from 'querystring'
import {createAction} from 'redux-actions'

import {API} from 'lib/constants'

import fetch from './fetch'

const PROJECT_URL = API.Project

export const loadProject = (_id: string) =>
  fetch({
    url: `${PROJECT_URL}/${_id}`,
    next: (r) => set(r.value)
  })

export const set = createAction('set project')
export const setAll = createAction('set projects')
export const loadProjects = (query = {}) =>
  fetch({
    url: `${PROJECT_URL}?${stringify(query)}`,
    next: (response) => setAll(response.value)
  })
