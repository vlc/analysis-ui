import {useMemo} from 'react'

/**
 * Hook to construct a grid for display purposes by subtracting the comparison from the base if there are two.
 * @param grid
 * @param comparisonGrid
 * @returns
 */
export function useDisplayGrid(
  grid?: CL.RegionalGrid,
  comparisonGrid?: CL.RegionalGrid
) {
  return useMemo(() => {
    if (grid != null) {
      if (comparisonGrid != null) return subtract(grid, comparisonGrid)
      return grid
    }
  }, [grid, comparisonGrid])
}

/**
 * Non-destructively subtract grid B from grid A
 */
function subtract(a: CL.RegionalGrid, b: CL.RegionalGrid): CL.RegionalGrid {
  const gridsDoNotAlign =
    a.west !== b.west ||
    a.north !== b.north ||
    a.zoom !== b.zoom ||
    a.width !== b.width ||
    a.height !== b.height

  if (gridsDoNotAlign) {
    throw new Error('Grids do not align for subtraction')
  }

  const newGrid = {
    ...a,
    data: new Int32Array(a.width * a.height),
    min: Infinity,
    max: -Infinity
  }

  for (let pixel = 0; pixel < a.width * a.height; pixel++) {
    const val = a.data[pixel] - b.data[pixel]
    newGrid.min = Math.min(newGrid.min, val)
    newGrid.max = Math.max(newGrid.max, val)
    newGrid.data[pixel] = val
  }

  // To be consistent with Grid formats. Contains comes from the other grids.
  newGrid.getValue = (x, y) =>
    newGrid.contains(x, y) ? newGrid.data[y * a.width + x] : 0

  return newGrid
}
