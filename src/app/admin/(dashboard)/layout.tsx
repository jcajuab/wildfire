import type { Metadata } from "next"

import { DashboardLayout } from "#/components/DashboardLayout"

export const metadata: Metadata = {
  title: "WILDFIRE | Admin",
  // TODO: Add description
}

export default function Layout({ children }: LayoutProps<"/admin">) {
  return <DashboardLayout>{children}</DashboardLayout>
}
