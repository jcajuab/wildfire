import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import { MantineRootProvider } from "#/providers/MantineRootProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WILDFIRE",
  description: "A Digital Signage Management Solution for USC - DCISM",
}

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <MantineRootProvider>{children}</MantineRootProvider>
      </body>
    </html>
  )
}
