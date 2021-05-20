import DestinationPointsetSelect from './destination-pointset-select'

// Cannot pass `parseInt` directly because of radix
const parseCutoff = (c) => parseInt(c)

export default function ComparisonDisplay({
  analysis,
  comparisonAnalysis
}: {
  analysis: CL.RegionalAnalysis
  comparisonAnalysis: CL.RegionalAnalysis
}) {
  const dispatch = useDispatch()
  const router = useRouter()
  const comparisonCutoff = useSelector(selectComparisonCutoff)
  const comparisonPercentile = useSelector(selectComparisonPercentile)
  const comparisonPointSet = useSelector(selectComparisonPointSet)
  const routeTo = useShallowRouteTo('regionalAnalyses', {
    analysisId: analysis._id,
    regionId: analysis.regionId
  })
  const query = router.query as CL.Query

  const onChangeCutoff = useCallback((v) => routeTo({comparisonCutoff: v}), [
    routeTo
  ])
  const comparisonCutoffInput = useControlledInput({
    onChange: onChangeCutoff,
    parse: parseCutoff,
    value: query.comparisonCutoff
  })

  const onChangePercentile = useCallback(
    (v) => routeTo({comparisonPercentile: v}),
    [routeTo]
  )
  const comparisonPercentileInput = useControlledInput({
    onChange: onChangePercentile,
    parse: parseCutoff,
    value: query.comparisonPercentile
  })

  const onChangeDestinationPointSet = useCallback(
    (v) => routeTo({comparisonDestinationPointSetId: v}),
    [routeTo]
  )

  // Set the parameters on load to decouple them from the primary ones.
  useOnMount(() => {
    routeTo({
      comparisonCutoff,
      comparisonPercentile,
      comparisonDestinationPointSetId: get(comparisonPointSet, '_id')
    })
  })

  useEffect(() => {
    dispatch(
      loadRegionalAnalysisGrid(
        comparisonAnalysis,
        parseInt(comparisonCutoff),
        parseInt(comparisonPercentile),
        get(comparisonPointSet, '_id')
      )
    )
  }, [
    comparisonAnalysis,
    comparisonCutoff,
    comparisonPercentile,
    comparisonPointSet,
    dispatch
  ])

  return (
    <>
      <Stack spacing={4} px={4} pb={4}>
        {analysis.workerVersion !== comparisonAnalysis.workerVersion && (
          <Alert status='error'>
            <AlertIcon />
            {message('r5Version.comparisonIsDifferent')}
          </Alert>
        )}

        {Array.isArray(comparisonAnalysis.destinationPointSetIds) && (
          <Box>
            <DestinationPointsetSelect
              analysis={comparisonAnalysis}
              onChange={onChangeDestinationPointSet}
              value={get(comparisonPointSet, '_id')}
            />
          </Box>
        )}

        <Stack isInline>
          {Array.isArray(comparisonAnalysis.cutoffsMinutes) && (
            <ChakraSelect {...comparisonCutoffInput}>
              {comparisonAnalysis.cutoffsMinutes.map((m) => (
                <option key={m} value={m}>
                  {m} minutes
                </option>
              ))}
            </ChakraSelect>
          )}
          {Array.isArray(comparisonAnalysis.travelTimePercentiles) && (
            <ChakraSelect {...comparisonPercentileInput}>
              {comparisonAnalysis.travelTimePercentiles.map((p) => (
                <option key={p} value={p}>
                  {p}th percentile
                </option>
              ))}
            </ChakraSelect>
          )}
        </Stack>
      </Stack>
    </>
  )
}
