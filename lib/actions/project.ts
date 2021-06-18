import {stringify} from 'querystring'
import {createAction} from 'redux-actions'

import {API} from 'lib/constants'

import fetch from './fetch'
import getFeedsRoutesAndStops from './get-feeds-routes-and-stops'
import {getForProject as getModificationsForProject} from './modifications'

import {loadBundle} from './'

const PROJECT_URL = API.Project

export const loadProject = (_id: string) =>
  fetch({
    url: `${PROJECT_URL}/${_id}`,
    next: (r) => set(r.value)
  })

export const loadProjectAndModifications = (_id) => async (dispatch) => {
  const r1 = await Promise.all([
    dispatch(loadProject(_id)),
    dispatch(getModificationsForProject(_id))
  ])
  const project = r1[0]
  const modifications = r1[1]

  const r2 = await Promise.all([
    dispatch(loadBundle(project.bundleId)),
    dispatch(
      getFeedsRoutesAndStops({
        bundleId: project.bundleId,
        forceCompleteUpdate: true,
        modifications
      })
    )
  ])

  return {bundle: r2[0], feeds: r2[1], modifications, project}
}

export const set = createAction('set project')
export const setAll = createAction('set projects')
export const loadProjects = (query = {}) =>
  fetch({
    url: `${PROJECT_URL}?${stringify(query)}`,
    next: (response) => setAll(response.value)
  })
