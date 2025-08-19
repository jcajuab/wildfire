import { Progress, Skeleton, Text, Title } from "@mantine/core"

import styles from "./DisplayCardNowPlaying.module.css"

// TODO: Figure out contentName, playlistName, and progressValue, they seem suspicious
type DisplayCardNowPlayingProps = {
  contentName?: string
  playlistName?: string
  progressValue?: number
}

// TODO: Accept an image
export function DisplayCardNowPlaying({
  contentName,
  playlistName,
  progressValue,
}: DisplayCardNowPlayingProps) {
  return (
    <div className={styles.grid}>
      {/* TODO: Replace this with an image */}
      <Skeleton animate={false} width={50} height={50} />
      <Title order={3} size="sm">
        {contentName ?? "N/A"}
      </Title>
      <Text size="xs" c="dimmed">
        From playlist: {playlistName ?? "N/A"}
      </Text>
      <Progress value={progressValue ?? 0} mt="auto" />
    </div>
  )
}
