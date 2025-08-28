"use client"

import {
  ActionIcon,
  Badge,
  Card,
  Group,
  Menu,
  Skeleton,
  Text,
  Title,
} from "@mantine/core"
import { EllipsisIcon, InfoIcon, PencilIcon, TrashIcon } from "lucide-react"

import type { Display } from "#/features/displays/types"

import styles from "./DisplayCard.module.css"

const STATUS_COLORS: Record<Display["status"], string> = {
  Ready: "green",
  Live: "red",
  Down: "gray",
}

type DisplayCardProps = Display

// TODO: Implement view, edit, and remove functionality
// TODO: Update "Now playing" when content and playlist features are implemented
export function DisplayCard({
  name,
  status,
  location,
  groups,
}: DisplayCardProps) {
  const handleView = () => {}
  const handleEdit = () => {}
  const handleRemove = () => {}

  return (
    <Card withBorder>
      <Card.Section pt="sm" inheritPadding>
        <div className={styles.header}>
          <Title order={2} size="xl" fw={600}>
            {name}
          </Title>
          <Badge
            color={STATUS_COLORS[status] || "yellow"}
            size="xs"
            variant="light"
          >
            {status}
          </Badge>
          <Menu position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon color="gray" size="sm" variant="subtle">
                <EllipsisIcon />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                leftSection={<InfoIcon size="var(--mantine-font-size-sm)" />}
                onClick={handleView}
              >
                View Details
              </Menu.Item>
              <Menu.Item
                leftSection={<PencilIcon size="var(--mantine-font-size-sm)" />}
                onClick={handleEdit}
              >
                Edit Details
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                leftSection={<TrashIcon size="var(--mantine-font-size-sm)" />}
                onClick={handleRemove}
              >
                Remove Display
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
        <Text size="sm" truncate="end" c="dimmed">
          {location ?? "No location provided"}
        </Text>
      </Card.Section>
      <Card.Section mt="sm" inheritPadding>
        <Group gap="xs">
          {groups.map(({ id, name }) => (
            <Badge key={id} color="blue" variant="light" tt="none">
              {name}
            </Badge>
          ))}
        </Group>
      </Card.Section>
      <Card.Section mt="sm" pb="sm" inheritPadding>
        <Text size="xs" c="dimmed" tt="uppercase">
          Now playing
        </Text>
        <div className={styles.nowPlaying}>
          <Skeleton animate={false} height={32} width={32} />
          <Title order={3} size="sm" fw={500}>
            N/A
          </Title>
          <Text size="xs" c="dimmed" inline>
            From playlist: N/A
          </Text>
          <Text size="xs" c="dimmed">
            0:00
          </Text>
        </div>
      </Card.Section>
    </Card>
  )
}
