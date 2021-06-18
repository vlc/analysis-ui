import {getDefaultRegion, scratchRegion} from '../utils'

describe('Regional', () => {
  const region = getDefaultRegion()

  describe('Create Modal', () => {
    it('should show total origins', () => {
      region.initializeAnalysisDefaults()
      region.fetchAccessibilityComparison(region.center)
      cy.getPrimaryAnalysisSettings().within(() => {
        cy.findButton(/Regional analysis/).click()
      })
      cy.findByText(/Analysis will run for 11,644 origin points/)
      cy.findButton(/Cancel/).click()
    })
  })

  describe('Results', () => {
    const regionalAnalysis = region.getRegionalAnalysis('Basic Regional Test', {
      settings: {
        bounds: scratchRegion.customRegionSubset
      }
    })

    // For faster testing results, comment out the below
    after(() => regionalAnalysis.delete())

    beforeEach(() => {
      cy.findByText(/Access to/i)
        .parent()
        .as('legend')
    })

    it('verifies regional analysis results', function () {
      cy.get('@legend').should('not.contain', 'Loading grids')
      // compare to self with different time cutoff and check the legend again
      cy.findByLabelText(/Compare to/).type(`${regionalAnalysis.name}{enter}`, {
        force: true
      })
      // TODO make these select elements easier to identify
      cy.findByText(/Compare to/)
        .parent()
        .next()
        .findByRole('option', {name: '45 minutes'})
        .parent()
        .select('60 minutes')
      cy.get('@legend').should('not.contain', 'Loading grids')
    })

    it('links to projects correctly', () => {
      regionalAnalysis.navTo()
      cy.findByText(region.defaultProject.name).click()
      cy.findButton(/Create a modification/)
    })
  })

  // notit('test starting and deleting a running analysis')
  // cy.findByRole('button', {name: /Delete/}).click()
  // cy.findByRole('button', {name: /Confirm/}).click()

  // TODO this is partly tested above but should be refactored into its own
  // test here. This will require setting up an analysis first though
  // notit('compares two regional analyses')

  // TODO this is partly tested above, but should be separated out into its
  // own test here. Aggregation is blocked by a dissociated label
  // (see note above)
  // notit('uploads an aggregation area and aggregates results')
})
