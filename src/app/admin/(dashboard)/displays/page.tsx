import {
  Group,
  Pagination,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core"

import { DisplayCardGrid } from "#/features/displays/components/DisplayCardGrid"
import { displays } from "#/features/displays/data"

// TODO: Implement add display functionality
// TODO: Add pagination, search, and filtering logic
export default function Page() {
  return (
    <Stack h="100%">
      <Group justify="space-between">
        <Title>Displays</Title>
      </Group>
      <ScrollArea flex={1}>
        <DisplayCardGrid displays={displays} />
      </ScrollArea>
      <Group justify="space-between" mt="auto">
        <Text size="sm" c="dimmed">
          Showing 1 to 4 of 4 results
        </Text>
        <Pagination size="sm" total={1} />
      </Group>
    </Stack>
  )
}
