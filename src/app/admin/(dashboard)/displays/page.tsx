import {
  Group,
  Pagination,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core"

import { DisplayCard } from "#/features/displays/components/DisplayCard"
import { displays } from "#/features/displays/data"

export default function Page() {
  return (
    <Stack h="100%">
      <Group justify="space-between">
        <Title>Displays</Title>
      </Group>
      <ScrollArea>
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
          {displays.map(({ id, ...props }) => (
            <DisplayCard key={id} id={id} {...props} />
          ))}
        </SimpleGrid>
      </ScrollArea>
      <Group justify="space-between" mt="auto">
        {/* TODO: Add logic */}
        <Text size="sm" c="dimmed">
          Showing 1 to 4 of 4 results
        </Text>
        {/* TODO: Add logic */}
        <Pagination size="sm" total={1} />
      </Group>
    </Stack>
  )
}
