import useSWR from 'swr'

import {noRevalidateConfig} from 'lib/config/swr'
import useUser from 'lib/hooks/use-user'

import getStops from '../queries/get-stops'

export default function useStops(feedGroupId: string, feedId: string) {
  const {user} = useUser()
  const key = () => (user == null ? null : [feedGroupId, feedId, user])
  const res = useSWR<GTFS.Stop[]>(key, getStops, noRevalidateConfig)
  return res.data
}
