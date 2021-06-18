import Router, {useRouter} from 'next/router'
import {useCallback} from 'react'

import {PageKey} from 'lib/constants'

import useLink from './use-link'

import {pageToHref} from '../router'

/**
 * Create an `onClick` function for navigation.
 */
export default function useRouteTo(
  key: PageKey,
  props: Record<string, string> = {},
  options = {}
) {
  const link = useLink(key, props)

  const onClick = useCallback(
    (newProps?: any) => {
      if (newProps && !newProps.nativeEvent) {
        Router.push(pageToHref(key, {...props, ...newProps}), null, options)
      } else {
        Router.push(link, null, options)
      }
    },
    [link, options, props, key]
  )

  return onClick
}

const shallowOptions = {scroll: false, shallow: true}
export function useShallowRouteTo(
  key: PageKey,
  props: Record<string, string> = {}
) {
  const {query} = useRouter()
  return useRouteTo(key, {...(query as CL.Query), ...props}, shallowOptions)
}
