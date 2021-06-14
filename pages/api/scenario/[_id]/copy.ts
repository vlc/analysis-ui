import {getSession, withApiAuthRequired} from '@auth0/nextjs-auth0'

import AuthenticatedCollection from 'lib/db/authenticated-collection'
import {userFromSession} from 'lib/user'
import {errorToPOJO} from 'lib/utils/api'

export default withApiAuthRequired(async function (req, res) {
  try {
    const user = userFromSession(req, getSession(req, res))
    const scenarioId = req.query._id as string
    const scenarios = await AuthenticatedCollection.with('scenarios', user)
    const baseScenario = await scenarios.findOne(scenarioId)
    const newDocument = await scenarios.create({
      name: baseScenario.name + ' (copy)'
    })
    const newScenario = newDocument.ops[0]
    const scenariosModifications = await AuthenticatedCollection.with(
      'scenariosModifications',
      user
    )
    const allEntries = await scenariosModifications
      .findWhere({scenarioId})
      .toArray()

    // Create new entries overwriting the scenario id with the new id
    scenariosModifications.createMany(
      allEntries.map((e) => ({
        modificationId: e.modificationId,
        scenarioId: newScenario._id
      }))
    )
    res.status(200).json(newScenario)
  } catch (e) {
    res.status(400).json(errorToPOJO(e))
  }
})
