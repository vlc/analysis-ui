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
import {API} from 'lib/constants'
import useUser from 'lib/hooks/use-user'
import authFetch, {authFetchText} from 'lib/utils/auth-fetch'
import downloadObjectAsJson from 'lib/utils/download-json'

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
  analysis,
  cutoff,
  percentile,
  pointSetId
}: {
  analysis: CL.RegionalAnalysis
  cutoff: string
  percentile: string
  pointSetId: string
}) {
  const {user} = useUser()
  const toast = useToast({
    position: 'top',
    status: 'error',
    title: 'Download failed'
  })
  async function _downloadCSVResults(type: string) {
    const res = await authFetchText(
      `${API.Regional}/${analysis._id}/csv/${type}`,
      user
    )
    if (res.ok) {
      window.open(res.data)
    } else if (res.ok === false) {
      toast({description: res.error.message})
    }
  }

  async function _downloadRequestJSON() {
    const res = await authFetch(`${API.Regional}/${analysis._id}`, user)
    if (res.ok) {
      downloadObjectAsJson({
        data: res.data,
        filename: analysis.name + '.json'
      })
    } else if (res.ok === false) {
      toast({description: res.error.message})
    }
  }

  /**
   * Perform an authenticated fetch to get a presigned URL to download a grid
   * from S3, then download it. Pass in the path to fetch.
   */
  async function _downloadProjectGIS(e) {
    e.preventDefault()
    const res = await authFetch<{url: string}>(
      `${API.Regional}/${analysis._id}/grid/tiff?cutoff=${cutoff}&percentile=${percentile}&destinationPointSetId=${pointSetId}`,
      user
    )
    if (res.ok) {
      window.open(res.data.url)
    } else if (res.ok === false) {
      toast({description: res.error.message})
    }
  }

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
          onClick={_downloadProjectGIS}
        >
          GeoTIFF
        </MenuItem>
        <MenuItem onClick={_downloadRequestJSON}>
          Scenario and modification JSON
        </MenuItem>
        {Object.keys(analysis.resultStorage || {}).map((type) => (
          <MenuItem key={type} onClick={() => _downloadCSVResults(type)}>
            {csvResultsTypeToTitle[type]}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  )
}
