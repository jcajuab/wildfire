import { ActionIcon, Menu } from "@mantine/core"
import { EllipsisIcon, InfoIcon, PencilIcon, TrashIcon } from "lucide-react"

type DisplayCardMenuProps = {
  onView: () => void
  onEdit: () => void
  onRemove: () => void
}

export function DisplayCardMenu({
  onView,
  onEdit,
  onRemove,
}: DisplayCardMenuProps) {
  return (
    <Menu position="bottom-end" shadow="sm">
      <Menu.Target>
        <ActionIcon color="gray" size="sm" variant="subtle" ml="auto">
          <EllipsisIcon />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          leftSection={<InfoIcon size="var(--mantine-font-size-xs)" />}
          onClick={onView}
        >
          View Details
        </Menu.Item>
        <Menu.Item
          leftSection={<PencilIcon size="var(--mantine-font-size-xs)" />}
          onClick={onEdit}
        >
          Edit Details
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          color="red"
          leftSection={<TrashIcon size="var(--mantine-font-size-xs)" />}
          onClick={onRemove}
        >
          Remove Display
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
