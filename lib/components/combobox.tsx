import {
  Box,
  Flex,
  forwardRef,
  Input,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Spinner,
  Stack,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import fpGet from 'lodash/fp/get'
import {RefObject, useCallback, useEffect, useRef, useState} from 'react'

import {ChevronDown} from 'lib/components/icons'
import Tip from 'lib/components/tip'

const noop = () => {}

interface ComboboxProps<T> {
  isDisabled?: boolean
  isEqual?: (a: T, b: T) => boolean
  isLoading?: boolean
  onChange: (newValue: T) => Promise<void> | void
  options: T[]
  placeholder?: string
  getOptionLabel?: (option: T) => string
  getOptionValue?: (option: T) => string
  value?: T
  variant?: 'ghost' | 'normal'
  width?: string
}

interface ComboboxSearchProps<T> extends ComboboxProps<T> {
  inputRef: RefObject<HTMLInputElement>
}

function ComboboxSearch<T>({
  inputRef,
  getOptionLabel,
  getOptionValue,
  onChange,
  options,
  placeholder,
  value
}: ComboboxSearchProps<T>) {
  const [filter, setFilter] = useState('')
  const [displayedOptions, setDisplayedOptions] = useState<T[]>(options)

  useEffect(() => {
    if (filter?.length > 0) {
      setDisplayedOptions(
        options.filter((o) => getOptionLabel(o).indexOf(filter) > -1)
      )
    } else {
      setDisplayedOptions(options)
    }
  }, [filter, getOptionLabel, options])

  return (
    <Stack spacing={0}>
      <Input
        onChange={(e) => setFilter(e.currentTarget.value)}
        pl={3}
        placeholder={placeholder}
        ref={inputRef}
        size='lg'
        variant='flushed'
        value={filter}
      />
      <Stack spacing={0} maxHeight='5.5rem' overflowY='scroll'>
        {displayedOptions.map((r) => (
          <Box
            key={getOptionValue(r)}
            bg={r === value ? 'blue.50' : 'white'}
            cursor='pointer'
            onClick={() => onChange(r)}
            px={3}
            py={2}
            _hover={{
              bg: 'blue.500',
              color: 'white'
            }}
            rounded={0}
            fontSize='lg'
          >
            <Text
              overflowX='hidden'
              textAlign='left'
              textOverflow='ellipsis'
              whiteSpace='nowrap'
            >
              {getOptionLabel(r)}
            </Text>
          </Box>
        ))}
      </Stack>
    </Stack>
  )
}

const Trigger = forwardRef(
  ({isDisabled, isLoading, label, onClick, width, ...p}, ref) => {
    return (
      <Flex
        align='center'
        borderWidth='1px'
        cursor='pointer'
        onClick={isDisabled ? noop : onClick}
        onFocus={isDisabled ? noop : onClick}
        py={2}
        px={3}
        justify='space-between'
        ref={ref}
        role='group'
        tabIndex={0}
        rounded='md'
        width={width}
        {...p}
      >
        <Box pr={3}>{label}</Box>
        <Box borderLeftWidth='1px' opacity={0.3} pl={3}>
          {isLoading ? (
            <Box pt={1}>
              <Spinner size='xs' />
            </Box>
          ) : (
            <ChevronDown />
          )}
        </Box>
      </Flex>
    )
  }
)

const defaultGetOptionLabel = fpGet('label')
const defaultGetOptionValue = fpGet('value')
const defaultIsEqual = (a: any, b: any) => a === b
const minWidth = 300

export default function Combobox<T>({
  getOptionLabel = defaultGetOptionLabel,
  getOptionValue = defaultGetOptionValue,
  isDisabled = false,
  isEqual = defaultIsEqual,
  isLoading = false,
  onChange,
  options,
  placeholder = 'Search',
  value,
  width = '100%'
}: ComboboxProps<T>) {
  const inputRef = useRef<HTMLInputElement>()
  const [selectedValue, setSelectedValue] = useState(() =>
    options.find((o) => isEqual(o, value))
  )
  const {isOpen, onClose, onOpen} = useDisclosure()
  const [popoverWidth, setPopoverWidth] = useState(minWidth)

  useEffect(() => {
    if (value != null) setSelectedValue(options.find((o) => isEqual(o, value)))
  }, [isEqual, options, value])

  const finalOnChange = useCallback(
    (newValue: T) => {
      onClose()
      setSelectedValue(newValue)
      requestAnimationFrame(async () => {
        await onChange(newValue)
      })
    },
    [onChange, onClose, setSelectedValue]
  )

  if (!isOpen) {
    if (selectedValue != null) {
      return (
        <Tip isDisabled={isDisabled} label={placeholder} placement='right'>
          <div style={{width}}>
            <Trigger
              isDisabled={isDisabled}
              isLoading={isLoading}
              label={getOptionLabel(selectedValue)}
              onClick={onOpen}
              width={width}
            />
          </div>
        </Tip>
      )
    } else {
      return (
        <Trigger
          isDisabled={isDisabled}
          isLoading={isLoading}
          label={placeholder}
          onClick={onOpen}
          width={width}
        />
      )
    }
  }

  return (
    <Popover
      initialFocusRef={inputRef}
      isOpen={true}
      onClose={onClose}
      placement='bottom-start'
      isLazy
    >
      <PopoverTrigger>
        <div
          ref={(ref) => {
            const width = ref?.getBoundingClientRect()?.width
            console.log('div.width', width)
            if (width > minWidth) setPopoverWidth(width)
          }}
        >
          <Trigger
            isDisabled={false}
            isLoading={isLoading}
            label={selectedValue ? getOptionLabel(selectedValue) : placeholder}
            onClick={noop}
            shadow='outline'
            width={width}
          />
        </div>
      </PopoverTrigger>
      <Portal>
        <PopoverContent mb={3} shadow='lg' width={popoverWidth}>
          <PopoverBody p={0}>
            <ComboboxSearch<T>
              inputRef={inputRef}
              placeholder={placeholder}
              getOptionLabel={getOptionLabel}
              getOptionValue={getOptionValue}
              onChange={finalOnChange}
              options={options}
              value={selectedValue}
            />
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}
