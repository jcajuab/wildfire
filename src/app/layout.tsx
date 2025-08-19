import type { Metadata } from "next"
import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core"
import { Inter } from "next/font/google"

import { MantineThemeProvider } from "#/providers/MantineThemeProvider"

import "@mantine/core/styles.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "WILDFIRE",
  // TODO: Add description
}

type LayoutProps = {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={inter.className}>
        <MantineThemeProvider>{children}</MantineThemeProvider>
      </body>
    </html>
  )
}
