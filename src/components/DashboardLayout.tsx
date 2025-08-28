"use client"

import { AppShell, NavLink, ScrollArea, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import {
  CalendarIcon,
  FileImageIcon,
  ListMusicIcon,
  LogsIcon,
  type LucideIcon,
  MonitorIcon,
  ShieldIcon,
  UsersIcon,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ComponentProps } from "react"

import styles from "./DashboardLayout.module.css"

type NavbarLink = {
  href: ComponentProps<typeof Link>["href"]
  label: string
  icon: LucideIcon
}

const navbarLinks = [
  { href: "/admin/displays", label: "Displays", icon: MonitorIcon },
  { href: "/admin/content", label: "Content", icon: FileImageIcon },
  { href: "/admin/playlists", label: "Playlists", icon: ListMusicIcon },
  { href: "/admin/schedules", label: "Schedules", icon: CalendarIcon },
  { href: "/admin/users", label: "Users", icon: UsersIcon },
  { href: "/admin/roles", label: "Roles", icon: ShieldIcon },
  { href: "/admin/logs", label: "Logs", icon: LogsIcon },
] as const satisfies NavbarLink[]

type DashboardLayoutProps = {
  children: React.ReactNode
}

// TODO: Add a navbar footer with user info and logout button
// FIXME: Make this mobile-friendly
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isOpen] = useDisclosure()
  const pathname = usePathname()

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 200, // No clue why it's 200
        breakpoint: "xs",
        collapsed: { mobile: !isOpen },
      }}
    >
      <AppShell.Navbar>
        <AppShell.Section p="md" className={styles.header}>
          <Text size="xl" c="blue" fw={700} inline>
            WILDFIRE
          </Text>
        </AppShell.Section>
        <AppShell.Section component={ScrollArea} p="md" grow>
          {navbarLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <NavLink
                key={href}
                active={isActive}
                label={label}
                leftSection={<Icon size="var(--mantine-font-size-sm)" />}
                variant="filled"
                fw={isActive ? 500 : undefined}
                component={Link}
                href={href}
              />
            )
          })}
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main
        h="1px" // Allow children to use percentage-based heights
      >
        {children}
      </AppShell.Main>
    </AppShell>
  )
}
