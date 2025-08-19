"use client"

import { createTheme, Modal } from "@mantine/core"

export const theme = createTheme({
  autoContrast: true,
  fontFamily: "Inter",
  defaultRadius: "sm",
  components: {
    Modal: Modal.extend({
      defaultProps: {
        centered: true,
      },
    }),
  },
})
