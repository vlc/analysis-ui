import {UserProfile} from '@auth0/nextjs-auth0'
import {RGBColor} from 'd3-color'

declare global {
  namespace CL {
    /**
     * Extended user type
     */
    export interface User extends UserProfile {
      accessGroup: string
      adminTempAccessGroup?: string
      idToken?: string
    }

    /**
     * Common geospatial coordinate types
     */
    export type LonLat = {
      lon: number
      lat: number
    }
    export type Point = {
      x: number
      y: number
    }

    /**
     * Commonly used bounds object
     */
    export interface Bounds {
      north: number
      south: number
      east: number
      west: number
    }

    /**
     * Segment speeds. Stored in timetables for ATP and directly on the modification for Reroute.
     */
    export type SegmentSpeeds = number[]

    /**
     * A stored segment for a modification.
     */
    export type ModificationSegment = {
      fromStopId: void | string
      geometry: GeoJSON.Point | GeoJSON.LineString
      spacing: number
      stopAtEnd: boolean
      stopAtStart: boolean
      toStopId: void | string
    }

    /**
     * Generated from segments, not stored.
     */
    export type StopFromSegment = L.LatLngLiteral & {
      stopId: void | string
      index: number
      autoCreated: boolean
      distanceFromStart: number
    }

    /**
     * A MongoDB ObjectID. May be turned into a legitimate `ObjectId` later
     */
    export type ObjectID = string

    /**
     * Base DB Model with common properties.
     */
    export interface IModel {
      _id: ObjectID
      accessGroup: string
      nonce: ObjectID
      name: string
      createdAt: string
      updatedAt: string
    }

    /**
     * Region model
     */
    export interface Region extends IModel {
      bounds: Bounds
      description: string
    }

    /**
     * Analysis request presets
     */
    export interface Preset extends IModel {
      profileRequest: Record<string, unknown>
      regionId: string
    }

    export type Timetable = {
      segmentSpeeds: SegmentSpeeds
    }

    /**
     *
     */
    export type ModificationTypes =
      | 'add-streets'
      | 'add-trip-pattern'
      | 'modify-streets'
      | 'reroute'

    /**
     * Base modification
     */
    export interface IModification extends IModel {
      projectId: string
      type: ModificationTypes
    }

    /**
     *
     */
    export interface AddStreets extends IModification {
      type: 'add-streets'
      lineStrings: GeoJSON.Position[][]
    }

    /**
     *
     */
    export interface ModifyStreets extends IModification {
      type: 'modify-streets'
      polygons: GeoJSON.Position[][]
    }

    /**
     *
     */
    export interface AddTripPattern extends IModification {
      type: 'add-trip-pattern'
      segments: ModificationSegment[]
      timetables: Timetable[]
    }

    /**
     *
     */
    export interface Reroute extends IModification {
      type: 'reroute'
      segments: ModificationSegment[]
      segmentSpeeds: SegmentSpeeds
    }

    /**
     * Spatial Datasets
     */
    export interface SpatialDataset extends IModel {
      bucketName: string
      format: string
      sourceId: string
      sourceName: string
    }

    export interface GTFSErrorSummary {
      field?: string
      file?: string
      line?: number
      message: string
    }

    export interface GTFSErrorTypeSummary {
      count: number
      priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN'
      someErrors: GTFSErrorSummary[]
      type: string
    }

    export interface FeedSummary {
      feedId: string
      name: string
      serviceStart: string
      serviceEnd: string
      errors?: GTFSErrorTypeSummary[]
    }

    export interface Bundle extends IModel {
      feedGroupId: string
      feeds?: FeedSummary[]
      osmId: string
      regionId: string
      status: string
      statusText: string
    }

    export interface Project extends IModel {
      bundleId: string
      regionId: string
      variants: string[]
    }

    export interface RegionalAnalysis extends GridHeader, IModel {
      bundleId: string
      // On older versions of regional analyses
      cutoffMinutes?: number
      travelTimePercentile?: number

      // v6.0 and up all have the following set
      cutoffsMinutes?: number[]
      destinationPointSetIds?: string[]
      travelTimePercentiles?: number[]

      projectId: string
      regionId: string
      request: {
        accessModes: string
        date: string
        egressModes: string
        fromTime: number
        originPointSetKey?: string
        toTime: number
        transitModes: string
      }
      resultStorage?: Record<string, string>

      variant: number
      workerVersion: string
    }

    export interface RegionalAnalysisVariant {
      analysis: RegionalAnalysis
      cutoff: number
      percentile: number
      pointSetId: string
      isValid: boolean
    }

    export interface RegionalJob {
      activeWorkers: number
      complete: number
      jobId: string
      regionalAnalysis: RegionalAnalysis
      statusText?: string
      total: number
    }

    export interface RegionalDisplayScale {
      breaks: number[]
      colorRange: RGBColor[]
      colorizer: (v: number) => number[]
      error: false | unknown
    }

    export interface AggregationArea extends IModel {
      regionId: string
    }

    export interface AggregateAccessibility {
      minAccessibility: number
      maxAccessibility: number
      percentiles: number[]
      weightedAverage: number
      bins: {
        value: number
        min: number
        max: number
      }[]
    }

    /**
     * Access Grids
     */

    export type GridHeader = {
      zoom: number
      west: number
      north: number
      width: number
      height: number
    }

    export type AccessGridHeader = GridHeader & {
      depth: number
      version: number
    }

    export type AccessGridMetadata = Record<string, unknown>

    export type AccessGrid = AccessGridHeader &
      AccessGridMetadata & {
        data: Int32Array
        errors: unknown[]
        warnings: any
        contains(x: number, y: number, z: number): boolean
        get(x: number, y: number, z: number): number
      }

    export type ParsedGrid = GridHeader & {
      data: Int32Array
      min: number
      max: number
      contains(x: number, y: number): boolean
      getValue(x: number, y: number): number
    }

    export type RegionalGrid = ParsedGrid & {
      analysisId: string
      cutoff: number
      percentile: number
      pointSetId: string
    }

    /**
     * Server Status
     */
    export type Status = {
      branch: string
      commit: string
      version: string
    }

    export type TaskState = 'ACTIVE' | 'ERROR' | 'DONE'

    export type TaskLogEntry = {
      level: string
      time: number
      message: string
    }

    export type TaskWorkProduct = {
      id: string
      regionId: string
      type: 'BUNDLE' | 'REGIONAL_ANALYSIS' | 'RESOURCE'
    }

    export type Task = {
      completionTime?: number
      detail: string
      id: string
      percentComplete: number
      startTime?: number
      state: TaskState
      secondsActive: number
      secondsComplete: number
      title: string
      workProduct?: TaskWorkProduct
    }

    /**
     * Server Activity
     */
    export type Activity = {
      systemStatusMessages: unknown[]
      taskBacklog: number
      taskProgress: Task[]
    }

    /**
     * Router query string. Cast params to string instead of `string | string[]`
     */
    export type Query = Record<string, string>

    /**
     * Base page component
     */
    export interface Page<T = {query: CL.Query}>
      extends React.FunctionComponent<T> {
      Layout?: React.FunctionComponent
    }

    /**
     * A "profile request" object
     */
    export interface ProfileRequest {
      bounds: CL.Bounds
      workerVersion: string
    }
  }
}
