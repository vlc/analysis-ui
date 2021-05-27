import {
  Menu,
  MenuButton,
  Button,
  MenuList,
  MenuItem,
  Center,
  useToast
} from '@chakra-ui/react'

import {DownloadIcon} from 'lib/components/icons'

import {
  useDownloadCSVResults,
  useDownloadProjectGIS,
  useDownloadRequestJSON
} from '../api'

// Type to title
const csvResultsTypeToTitle = {
  ACCESS: 'Access CSV',
  PATHS: 'Paths CSV',
  TIMES: 'Times CSV'
}

/**
 * Show a menu to generate and download the regional analysis outputs.
 */
export default function DownloadMenu({
  analysisVariant
}: {
  analysisVariant: CL.RegionalAnalysisVariant
}) {
  const toast = useToast({
    position: 'top',
    status: 'error',
    title: 'Download failed'
  })
  const onError = (err: Error) => toast({description: err.message})
  const {analysis} = analysisVariant
  const downloadCSVResults = useDownloadCSVResults(analysis._id)
  const downloadRequestJSON = useDownloadRequestJSON(analysis)
  const downloadProjectGIS = useDownloadProjectGIS(analysisVariant)

  return (
    <Menu isLazy>
      <MenuButton as={Button} colorScheme='blue'>
        <Center>
          <DownloadIcon />
          &nbsp; Download results
        </Center>
      </MenuButton>
      <MenuList>
        <MenuItem
          isDisabled={analysis.request.originPointSetKey != null}
          onClick={() => downloadProjectGIS().catch(onError)}
        >
          GeoTIFF
        </MenuItem>
        <MenuItem onClick={() => downloadRequestJSON().catch(onError)}>
          Scenario and modification JSON
        </MenuItem>
        {Object.keys(analysis.resultStorage || {}).map((type) => (
          <MenuItem
            key={type}
            onClick={() => downloadCSVResults(type).catch(onError)}
          >
            {csvResultsTypeToTitle[type]}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}
