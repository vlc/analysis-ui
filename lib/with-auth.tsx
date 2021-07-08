import {
  withPageAuthRequired,
  WithPageAuthRequiredProps
} from '@auth0/nextjs-auth0'
import {Box} from '@chakra-ui/react'
import Head from 'next/head'
import {ComponentType, useEffect} from 'react'

import LoadingScreen from 'lib/components/loading-screen'
import {AUTH_DISABLED} from 'lib/constants'
import useUser from 'lib/hooks/use-user'

import {localUser, storeUser} from './user'

export interface IWithAuthProps {
  user?: CL.User
}

// Check if the passed in group matches the environment variable
// TODO set this server side when the user logs in
const isAdmin = (user?: CL.User) =>
  user && user.accessGroup === process.env.NEXT_PUBLIC_ADMIN_ACCESS_GROUP

// DEV Bar Style
const DevBar = () => (
  <>
    <Box
      bg='red.500'
      height='1px'
      position='absolute'
      width='100%'
      zIndex={10000}
    />
  </>
)

/**
 * Ensure that a Page component is authenticated before rendering.
 */
export default function withAuth(PageComponent) {
  const AuthenticatedComponent: ComponentType<WithPageAuthRequiredProps> = (
    p
  ) => {
    const {isLoading, user} = useUser()

    useEffect(() => {
      if (user) storeUser(user)
    }, [user])

    if (isLoading || user == null) return <LoadingScreen />
    return (
      <>
        {isAdmin(user) ? (
          <DevBar />
        ) : (
          <Head>
            <style id='DEVSTYLE'>{`.DEV{display: none !important;}`}</style>
          </Head>
        )}
        <PageComponent user={user} {...p} />
      </>
    )
  }

  function UnauthenticatedComponent(p) {
    return (
      <>
        <DevBar />
        <PageComponent user={localUser} {...p} />
      </>
    )
  }

  return AUTH_DISABLED
    ? UnauthenticatedComponent
    : withPageAuthRequired(AuthenticatedComponent)
}
