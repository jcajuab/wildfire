// (1) Define the columns for the table
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Role = {
  id: string
  role: string
  totalUsers: number
}
