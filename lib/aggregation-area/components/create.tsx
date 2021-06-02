import {
  Alert,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast
} from '@chakra-ui/react'
import {useState} from 'react'

import FileSizeInputHelper from 'lib/components/file-size-input-helper'
import useInput from 'lib/hooks/use-controlled-input'
import useFileInput from 'lib/hooks/use-file-input'
import {useShallowRouteTo} from 'lib/hooks/use-route-to'
import message from 'lib/message'

import useCreateAggregationAreas from '../hooks/use-create-aggregation-areas'

/**
 * Form for creating aggregation areas
 */
export default function CreateAggregationArea({onClose, regionId}) {
  const [union, setUnion] = useState(true)
  const fileInput = useFileInput()
  const [uploading, setUploading] = useState(false)
  const toast = useToast({position: 'top'})
  const createAggregationAreas = useCreateAggregationAreas(regionId)
  const routeTo = useShallowRouteTo('regionalAnalysis')

  const nameInput = useInput({value: ''})
  const attributeInput = useInput({value: 'attribute'})

  async function upload() {
    setUploading(true)

    const formData = new window.FormData()
    formData.append('name', nameInput.value)
    formData.append('nameProperty', attributeInput.value)
    formData.append('union', `${union}`)
    if (Array.isArray(fileInput.files)) {
      for (const file of fileInput.files) {
        formData.append('files', file)
      }
    }

    try {
      const res = await createAggregationAreas(formData)
      if (res.ok === false) {
        toast({
          status: 'error',
          title: 'Upload failed',
          description: res.error.message
        })
      } else {
        toast({
          position: 'top',
          status: 'success',
          title: 'Upload complete',
          description: 'Aggregation area(s) have been successfully created.',
          isClosable: true
        })

        // Redirect to new aggregation area
        routeTo({aggregationAreaId: res.data[0]._id})

        onClose()
      }
    } catch (e) {
      setUploading(false)
    }
  }

  return (
    <Stack spacing={4}>
      <FormControl isDisabled={uploading} isRequired>
        <FormLabel htmlFor={nameInput.id}>
          {message('analysis.aggregationAreaName')}
        </FormLabel>
        <Input {...nameInput} />
      </FormControl>

      <FormControl isDisabled={uploading} isRequired>
        <FormLabel htmlFor='aggregationAreaFiles'>
          {message('analysis.aggregationAreaFiles')}
        </FormLabel>
        <Input
          id='aggregationAreaFiles'
          multiple
          onChange={fileInput.onChangeFiles}
          type='file'
          value={fileInput.value}
        />
        <FileSizeInputHelper />
      </FormControl>

      <Checkbox
        isChecked={union}
        isDisabled={uploading}
        onChange={(e) => setUnion(e.target.checked)}
      >
        Union
      </Checkbox>

      {!union && (
        <Stack spacing={4}>
          <Alert status='warning'>{message('analysis.separateFeatures')}</Alert>
          <FormControl isDisabled={uploading} isRequired>
            <FormLabel htmlFor={attributeInput.id}>
              {message('analysis.attributeName')}
            </FormLabel>
            <Input {...attributeInput} />
          </FormControl>
        </Stack>
      )}

      <Button
        isFullWidth
        isDisabled={
          uploading || !nameInput.value || !Array.isArray(fileInput.files)
        }
        isLoading={uploading}
        loadingText='Creating aggregation area'
        onClick={upload}
        colorScheme='green'
      >
        {message('common.upload')}
      </Button>
    </Stack>
  )
}
