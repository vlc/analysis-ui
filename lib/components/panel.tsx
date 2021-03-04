import {Box, Flex} from '@chakra-ui/react'
import {useState} from 'react'

import {CaretDown, CaretRight} from 'lib/components/icons'

export function Panel({children}) {
  return (
    <Box borderWidth='1px' shadow='xs'>
      {children}
    </Box>
  )
}

export function Collapsible({defaultExpanded = true, children, heading}) {
  const [isOpen, setIsOpen] = useState(defaultExpanded)

  return (
    <Panel>
      <Heading
        onClick={() => setIsOpen((isOpen) => !isOpen)}
        style={{cursor: 'pointer'}}
      >
        <Box>{heading}</Box>
        <Box>{isOpen ? <CaretDown /> : <CaretRight />}</Box>
      </Heading>
      {isOpen && children}
    </Panel>
  )
}

export function Heading({children, ...p}) {
  return (
    <Flex role='button' bg='gray.50' justify='space-between' p={4} {...p}>
      {children}
    </Flex>
  )
}

export function Body({children, ...p}) {
  return (
    <Box p={4} {...p}>
      {children}
    </Box>
  )
}
