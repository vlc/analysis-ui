import {useUser} from '@auth0/nextjs-auth0'

import {AUTH_DISABLED} from 'lib/constants'
import {localUser} from 'lib/user'

function useLocalUser() {
  return {
    isLoading: false,
    user: localUser
  }
}

function useConveyalUser() {
  const response = useUser()
  return {
    ...response,
    user: response?.user as CL.User
  }
}

export default AUTH_DISABLED ? useLocalUser : useConveyalUser
