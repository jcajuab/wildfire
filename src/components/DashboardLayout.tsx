"use client"

import { AppShell, Avatar, NavLink, ScrollArea, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import {
  CalendarIcon,
  FileImageIcon,
  ListMusicIcon,
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
] as const satisfies NavbarLink[]

type DashboardLayoutProps = {
  children: React.ReactNode
}

// TODO: Make this mobile friendly
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isOpen] = useDisclosure()
  const pathname = usePathname()

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 260, // No clue why it's 260
        breakpoint: "md",
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
          {navbarLinks.map(({ href, label, icon: Icon }) => (
            <NavLink
              key={href}
              active={pathname === href}
              label={label}
              variant="filled"
              leftSection={<Icon size="var(--mantine-font-size-md)" />}
              bdrs="sm"
              fw={500}
              component={Link}
              href={href}
            />
          ))}
        </AppShell.Section>
        {/* TODO: Add logic */}
        <AppShell.Section p="md" className={styles.footer}>
          <Avatar
            src={null}
            alt="Image not provided"
            name="Jan Carlo"
            color="initials"
          />
          <Text size="sm" fw={500} inline>
            Jan Carlo
          </Text>
          <Text size="xs" c="dimmed" inline>
            jcajuab@gmail.com
          </Text>
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
