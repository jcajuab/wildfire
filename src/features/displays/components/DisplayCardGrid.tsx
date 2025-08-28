import { DisplayCard } from "#/features/displays/components/DisplayCard"
import type { Display } from "#/features/displays/types"

import styles from "./DisplayCardGrid.module.css"

type DisplayCardGridProps = {
  displays: Display[]
}

export function DisplayCardGrid({ displays }: DisplayCardGridProps) {
  return (
    <div className={styles.grid}>
      {displays.map((display) => (
        <DisplayCard key={display.id} {...display} />
      ))}
    </div>
  )
}
