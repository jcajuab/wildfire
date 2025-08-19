"use client"

import { Badge, Card, Group, SimpleGrid, Text, Title } from "@mantine/core"
import { modals } from "@mantine/modals"
import { notifications } from "@mantine/notifications"
import { CheckIcon } from "lucide-react"

import { DisplayCardMenu } from "#/features/displays/components/DisplayCardMenu"
import { DisplayCardNowPlaying } from "#/features/displays/components/DisplayCardNowPlaying"
import { DisplayCardStatus } from "#/features/displays/components/DisplayCardStatus"
import type { Display, DisplayGroup } from "#/features/displays/types"

import styles from "./DisplayCard.module.css"

type DisplayCardProps = Display & {
  groups: DisplayGroup[]
  // TODO: Do something about contentName, playlistName, and progressValue; they are kinda suspicious
  contentName?: string
  playlistName?: string
  progressValue?: number
}

export function DisplayCard({
  name,
  location,
  status,
  output,
  resolution,
  groups,
  contentName,
  playlistName,
  progressValue,
}: DisplayCardProps) {
  // TODO: Add DisplayViewModal component
  const handleView = () => console.log("Ye")
  // TODO: Add DisplayEditModal component
  const handleEdit = () => console.log("Ye")
  const handleRemove = () => {
    modals.openConfirmModal({
      title: `Remove display "${name}"?`,
      children: (
        <Text size="sm">
          Are you sure you want to remove this display? This action cannot be
          undone, and you will need to reconnect the display to use it again.
        </Text>
      ),
      labels: { confirm: "Remove display", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: () => removeDisplay(name),
    })
  }

  return (
    <Card shadow="sm" withBorder>
      <Card.Section pt="sm" inheritPadding>
        <div className={styles.grid}>
          <Title order={2} size="lg" fw={600}>
            {name}
          </Title>
          <DisplayCardStatus status={status} />
          <DisplayCardMenu
            onView={handleView}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />
        </div>
        <Text size="sm" truncate="end" c="dimmed">
          {location ?? "No location provided"}
        </Text>
      </Card.Section>

      <Card.Section mt="sm" inheritPadding>
        {/* TODO: Show the first 3 display groups, truncating the rest and revealing them on hover */}
        <Group gap="sm">
          {groups.map(({ id, name }) => (
            <Badge key={id} color="blue" variant="light" tt="none">
              {name}
            </Badge>
          ))}
        </Group>
      </Card.Section>

      <Card.Section mt="sm" inheritPadding>
        <Text size="xs" c="dimmed" tt="uppercase">
          Now playing
        </Text>
        <DisplayCardNowPlaying
          contentName={contentName}
          playlistName={playlistName}
          progressValue={progressValue}
        />
      </Card.Section>

      <Card.Section mt="sm" pb="sm" inheritPadding>
        <SimpleGrid cols={2} spacing={0} verticalSpacing={0}>
          <Text size="xs" c="dimmed" tt="uppercase">
            Display output
          </Text>
          <Text size="xs" c="dimmed" tt="uppercase" ta="right">
            Resolution
          </Text>
          <Text fw={500} inline>
            {output}
          </Text>
          <Text fw={500} ta="right" inline>
            {resolution}
          </Text>
        </SimpleGrid>
      </Card.Section>
    </Card>
  )
}

// TODO: Implement actual logic here
function removeDisplay(name: string) {
  const id = notifications.show({
    loading: true,
    title: `Removing display "${name}"`,
    message: "This may take a while",
    autoClose: false,
    withCloseButton: false,
  })

  setTimeout(() => {
    notifications.update({
      id,
      loading: false,
      color: "green",
      icon: <CheckIcon size="var(--mantine-font-size-lg)" />,
      title: `Successfully removed display "${name}"`,
      message: "The display is now disconnected",
      autoClose: 2000,
      withCloseButton: true,
    })
  }, 3000)
}
