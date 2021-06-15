import {getSession, withApiAuthRequired} from '@auth0/nextjs-auth0'

import AuthenticatedCollection from 'lib/db/authenticated-collection'
import {withDefaultValues} from 'lib/modification/modification-default-values'
import {userFromSession} from 'lib/user'
import {errorToPOJO} from 'lib/utils/api'

export default withApiAuthRequired(async function (req, res) {
  try {
    const user = userFromSession(req, getSession(req, res))
    const projectId = req.query.projectId as string
    const modifications = await AuthenticatedCollection.with(
      'modifications',
      user
    )

    // Get the project bundle in order to set the default feed
    const bundles = await AuthenticatedCollection.with('bundles', user)
    const projects = await AuthenticatedCollection.with('projects', user)
    const project = await projects.findOne(projectId)
    const bundle = await bundles.findOne(project.bundleId)

    const newModification = await modifications.create(
      withDefaultValues({
        feedId: bundle?.feeds[0]?.feedId,
        name: req.body.name,
        projectId,
        type: req.body.type
      })
    )

    // TODO create a new entry for each modification in scenario-modifications

    res.status(201).json(newModification.ops[0])
  } catch (e) {
    res.status(400).json(errorToPOJO(e))
  }
})
