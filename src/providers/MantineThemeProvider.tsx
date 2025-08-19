"use client"

import { MantineProvider } from "@mantine/core"

import { theme } from "#/config/theme"

type MantineThemeProviderProps = {
  children: React.ReactNode
}

export function MantineThemeProvider({ children }: MantineThemeProviderProps) {
  return <MantineProvider theme={theme}>{children}</MantineProvider>
}
