import {Box, useColorModeValue} from '@chakra-ui/react'

const stringifyIfObject = (o: any) =>
  typeof o === 'object'
    ? JSON.stringify(o, null, ' ')
    : o.toString
    ? o.toString()
    : o

export const TDTitle = ({children}) => (
  <Box
    as='td'
    overflow='hidden'
    fontWeight={600}
    px={4}
    py={2}
    style={{
      textOverflow: 'ellipsis'
    }}
    textAlign='right'
    title={typeof children === 'string' ? children : undefined}
    width='35%'
  >
    {children}
  </Box>
)

export const TDValue = ({children}) => (
  <Box as='td' width='65%'>
    {children}
  </Box>
)

export default function ObjectToTable({color = 'blue', object}) {
  const bg = useColorModeValue(`${color}.50`, `${color}.900`)
  const keys = Object.keys(object)
  keys.sort()
  return (
    <Box
      as='table'
      fontFamily='mono'
      fontSize='sm'
      style={{
        tableLayout: 'fixed'
      }}
      width='100%'
    >
      <tbody>
        {keys.map((k) => (
          <Box as='tr' key={k} _odd={{bg}}>
            <TDTitle>{k}</TDTitle>
            <TDValue>
              <Box
                as='pre'
                bg='transparent'
                border='none'
                overflowX='auto'
                pr={3}
                py={2}
              >
                {stringifyIfObject(object[k])}
              </Box>
            </TDValue>
          </Box>
        ))}
      </tbody>
    </Box>
  )
}
