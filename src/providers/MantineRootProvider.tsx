"use client"

import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"

import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { Notifications } from "@mantine/notifications"

import { theme } from "#/config/theme"

type MantineRootProviderProps = {
  children: React.ReactNode
}

export function MantineRootProvider({ children }: MantineRootProviderProps) {
  return (
    <MantineProvider theme={theme}>
      <ModalsProvider>
        {children}
        <Notifications />
      </ModalsProvider>
    </MantineProvider>
  )
}
