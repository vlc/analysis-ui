import Bundles from 'lib/components/bundles'
import EditBundle from 'lib/components/edit-bundle'
import MapLayout from 'lib/layouts/map'

function BundleViewPage(p) {
  return (
    <Bundles regionId={p.query.regionId}>
      <EditBundle key={p.query.bundleId} />
    </Bundles>
  )
}

BundleViewPage.Layout = MapLayout

export default BundleViewPage
