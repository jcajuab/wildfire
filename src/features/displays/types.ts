// FIXME: Refine after integrating the database
export type Display = {
  id: string
  name: string
  slug: string
  location?: string
  status: "Ready" | "Live" | "Down" | (string & {})
  output: string
  resolution: string
  groups: {
    id: string
    name: string
  }[]
}
