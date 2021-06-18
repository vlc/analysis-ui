declare namespace GTFS {
  export type Pattern = {
    name: string
    pattern_id: string
    geometry: GeoJSON.LineString
  }

  export type Stop = {
    stop_id: string
    stop_lat: number
    stop_lon: number
    stop_name: string
  }

  export type Route = {
    route_id: string
    route_short_name?: string
    route_long_name?: string
    patterns?: Pattern[]
    stops?: Partial<Stop>[]
  }
}
