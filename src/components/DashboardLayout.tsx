"use client"

import { AppShell, NavLink } from "@mantine/core"
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

import styles from "./DashboardLayout.module.css"

type NavbarLink = {
  href: string
  label: string
  icon: LucideIcon
}

const navbarLinks = {
  primary: [
    { href: "/admin/displays", label: "Displays", icon: MonitorIcon },
    { href: "/admin/content", label: "Content", icon: FileImageIcon },
    { href: "/admin/playlists", label: "Playlists", icon: ListMusicIcon },
    { href: "/admin/schedules", label: "Schedules", icon: CalendarIcon },
  ],
  secondary: [
    { href: "/admin/users", label: "Users", icon: UsersIcon },
    { href: "/admin/roles", label: "Roles", icon: ShieldIcon },
  ],
} as const satisfies Record<string, NavbarLink[]>

type DashboardLayoutProps = {
  children: React.ReactNode
}

// TODO: Make this mobile-responsive
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isOpen] = useDisclosure()
  const pathname = usePathname()

  return (
    <AppShell
      padding="md"
      navbar={{
        width: 260,
        breakpoint: "sm",
        collapsed: { mobile: !isOpen },
      }}
    >
      <AppShell.Navbar>
        <AppShell.Section>
          {Object.entries(navbarLinks).map(([group, links]) => (
            <div key={group} className={styles.group}>
              {links.map(({ href, label, icon: Icon }) => {
                const isActive =
                  pathname === href || pathname.startsWith(`${href}/`)

                return (
                  <NavLink
                    key={href}
                    active={isActive}
                    label={label}
                    leftSection={<Icon className={styles.icon} />}
                    bdrs="sm"
                    component={Link}
                    href={href}
                  />
                )
              })}
            </div>
          ))}
        </AppShell.Section>
      </AppShell.Navbar>
      <AppShell.Main
        // Enables percentage-based heights in children
        h="1px"
      >
        {children}
      </AppShell.Main>
    </AppShell>
  )
}
