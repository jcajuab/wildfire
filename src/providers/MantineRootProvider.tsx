"use client"

import "@mantine/core/styles.css"
import "@mantine/notifications/styles.css"

import { createTheme, MantineProvider, Modal, NavLink } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { Notifications } from "@mantine/notifications"

const theme = createTheme({
  autoContrast: true,
  fontFamily: "Inter",
  defaultRadius: "md",
  components: {
    Modal: Modal.extend({
      defaultProps: {
        centered: true,
      },
    }),
    NavLink: NavLink.extend({
      defaultProps: {
        bdrs: "var(--mantine-radius-default)",
      },
    }),
  },
})

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
