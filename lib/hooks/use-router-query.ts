import {useRouter} from 'next/router'

export default function useRouterQuery(): CL.Query {
  const router = useRouter()
  return router.query as CL.Query
}
