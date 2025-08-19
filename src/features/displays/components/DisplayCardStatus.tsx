import { Badge } from "@mantine/core"
import {
  type LucideIcon,
  MonitorCheckIcon,
  MonitorPlayIcon,
  MonitorXIcon,
} from "lucide-react"

import type { DisplayStatus } from "#/features/displays/types"

type DisplayCardStatusProps = {
  status: DisplayStatus
}

export function DisplayCardStatus({ status }: DisplayCardStatusProps) {
  let color: string
  let Icon: LucideIcon | undefined

  switch (status) {
    case "Ready":
      color = "green"
      Icon = MonitorCheckIcon
      break
    case "Live":
      color = "red"
      Icon = MonitorPlayIcon
      break
    case "Down":
      color = "gray"
      Icon = MonitorXIcon
      break
    default:
      color = "yellow"
  }

  return (
    <Badge
      color={color}
      size="sm"
      variant="light"
      leftSection={Icon && <Icon size="var(--mantine-font-size-xs)" />}
    >
      {status}
    </Badge>
  )
}
