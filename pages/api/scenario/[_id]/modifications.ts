import {getSession, withApiAuthRequired} from '@auth0/nextjs-auth0'

import AuthenticatedCollection from 'lib/db/authenticated-collection'
import {userFromSession} from 'lib/user'
import {errorToPOJO} from 'lib/utils/api'

export default withApiAuthRequired(async function (req, res) {
  try {
    const user = userFromSession(req, getSession(req, res))
    const scenarioId = req.query._id as string
    const scenariosModifications = await AuthenticatedCollection.with(
      'scenariosModifications',
      user
    )
    const allEntries = await scenariosModifications.collection
      .aggregate([
        {
          $match: {
            accessGroup: user.accessGroup,
            scenarioId
          }
        },
        {
          $lookup: {
            from: 'modifications',
            localField: 'modificationId',
            foreignField: '_id',
            as: 'modification'
          }
        },
        {
          $unwind: {
            path: '$modification',
            preserveNullAndEmptyArrays: false
          }
        },
        {
          $addFields: {
            _id: '$modificationId',
            name: '$modification.name'
          }
        },
        {
          $project: {
            _id: 1,
            name: 1
          }
        }
      ])
      .toArray()
    res.status(200).json(allEntries)
  } catch (e) {
    res.status(400).json(errorToPOJO(e))
  }
})
