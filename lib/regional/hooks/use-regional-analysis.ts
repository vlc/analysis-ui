import {createUseModel} from 'lib/hooks/use-model'

const useRegionalAnalysis = createUseModel<CL.RegionalAnalysis>(
  'regional-analyses',
  {
    projection: {
      'request.scenario.modifications': 0
    }
  }
)

export default useRegionalAnalysis
