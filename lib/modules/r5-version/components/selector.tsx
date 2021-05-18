import {
  Alert,
  Box,
  Flex,
  FormControl,
  FormLabel,
  useToast
} from '@chakra-ui/react'
import {useEffect, useState} from 'react'
import Creatable from 'react-select/creatable'

import {ErrorIcon} from 'lib/components/icons'
import {selectStyles} from 'lib/components/select'
import Tip from 'lib/components/tip'
import message from 'lib/message'

import {MINIMUM_R5_VERSION, RECOMMENDED_R5_VERSION} from '../constants'
import {versionToNumber} from '../utils'

// Minimum version number
const MIN_VERSION = versionToNumber(MINIMUM_R5_VERSION)

// Create a new option from the select box
const _isValidNewOption = (newOption) => {
  try {
    return versionToNumber(newOption) >= MIN_VERSION
  } catch (e) {
    console.error(e)
    return false
  }
}

const _promptTextCreator = (label) =>
  message('r5Version.customVersionWarning', {
    version: label
  })

// Wrap text in a span and style it with a line-through
const lineThrough = (text) => (
  <span style={{textDecoration: 'line-through'}}>{text}</span>
)

type Option = {
  label: string | JSX.Element
  value: string
}

function mapAnalysesToOptions(
  regionalAnalyses: CL.RegionalAnalysis[]
): Option[] {
  const versions: Record<string, string[]> = {}
  for (const {name, workerVersion} of regionalAnalyses) {
    if (
      workerVersion === RECOMMENDED_R5_VERSION ||
      versionToNumber(workerVersion) < MIN_VERSION
    ) {
      continue
    }
    if (!versions[workerVersion]) versions[workerVersion] = []
    versions[workerVersion].push(name)
  }
  return Object.keys(versions).map((v) => ({
    value: v,
    label: `${v} — used in ${versions[v].join(', ')}`
  }))
}

const recommendedOption = {
  value: RECOMMENDED_R5_VERSION,
  label: `${RECOMMENDED_R5_VERSION} (recommended)`
}

/**
 * Select an R5 version, based on what is available in S3
 */
export default function SelectR5Version({
  isDisabled,
  onChange,
  regionalAnalyses,
  value = RECOMMENDED_R5_VERSION
}: {
  isDisabled: boolean
  onChange: (workerVersion: string) => void
  regionalAnalyses?: CL.RegionalAnalysis[]
  value: string
}) {
  const [lastUsedVersion, setLastUsedVersion] = useState<string>(null)
  const [options, setOptions] = useState<Option[]>([recommendedOption])
  const currentVersionNumber = versionToNumber(value)
  const toast = useToast({position: 'top'})

  // Update the used versions list based on regional analyses
  useEffect(() => {
    const newOptions: Option[] = [recommendedOption]

    if (value !== RECOMMENDED_R5_VERSION) {
      newOptions.push({
        value,
        label: versionToNumber(value) < MIN_VERSION ? lineThrough(value) : value
      })
    }

    if (Array.isArray(regionalAnalyses)) {
      setLastUsedVersion(regionalAnalyses[0]?.workerVersion)
      newOptions.push(...mapAnalysesToOptions(regionalAnalyses))
    }

    // Only set the new options if there is more than just the recommended
    if (newOptions.length > 1) setOptions(newOptions)
  }, [regionalAnalyses, value])

  function _selectVersion(result?: Option) {
    const version = result?.value
    if (versionToNumber(version) < MIN_VERSION) {
      return toast({
        title: 'Worker Version',
        description: message('r5Version.invalidVersion', {
          version,
          minimum: MINIMUM_R5_VERSION
        }),
        status: 'error'
      })
    }
    onChange(version)
  }

  return (
    <FormControl>
      <Flex justify='space-between'>
        <FormLabel htmlFor='select-r5-version'>
          {message('r5Version.title')}
        </FormLabel>
        <div>
          {lastUsedVersion && lastUsedVersion !== value && (
            <Tip label={message('r5Version.analysisVersionDifferent')}>
              <Box color='yellow.500'>
                <ErrorIcon />
              </Box>
            </Tip>
          )}
        </div>
      </Flex>
      <div>
        <Creatable
          name='select-r5-version'
          inputId='select-r5-version'
          formatCreateLabel={_promptTextCreator}
          isDisabled={isDisabled}
          isValidNewOption={_isValidNewOption}
          onChange={_selectVersion}
          options={options}
          styles={selectStyles}
          value={options.find((v) => v.value === value)}
        />
      </div>
      {currentVersionNumber < versionToNumber(RECOMMENDED_R5_VERSION) && (
        <Alert status='warning'>
          {message('r5Version.latestReleaseVersionNotSelected')}
        </Alert>
      )}
    </FormControl>
  )
}
