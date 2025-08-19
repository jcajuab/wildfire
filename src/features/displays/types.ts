export type DisplayStatus = "Ready" | "Live" | "Down" | (string & {})

// TODO: Refine after integrating the database
export type Display = {
  id: string
  name: string
  slug: string
  location?: string
  status: DisplayStatus
  output: string
  resolution: string
}

// TODO: Refine after integrating the database
export type DisplayGroup = {
  id: string
  name: string
}
