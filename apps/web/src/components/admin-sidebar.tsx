import { Link, type LinkOptions, useMatches } from '@tanstack/react-router'
// TODO: Remove Dynamic Icon, it slows down build
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'

import { ThemeToggleButton } from '#/components/theme-toggle-button'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '#/components/ui/sidebar'

type SidebarItem = {
  title: string
  url: LinkOptions['to']
  icon: IconName
}

const sidebarItems = [
  {
    title: 'Displays',
    url: '/admin/displays',
    icon: 'monitor',
  },
  {
    title: 'Content',
    url: '/admin/content',
    icon: 'file-image',
  },
  {
    title: 'Playlists',
    url: '/admin/playlists',
    icon: 'list-music',
  },
  {
    title: 'Schedules',
    url: '/admin/schedules',
    icon: 'calendar',
  },
] as const satisfies SidebarItem[]

export function AdminSidebar() {
  const matches = useMatches()

  return (
    <Sidebar collapsible='icon' variant='floating'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map(({ title, url, icon }) => (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton
                    asChild
                    isActive={matches.some((match) => match.fullPath === url)}
                  >
                    <Link to={url}>
                      <DynamicIcon name={icon} />
                      <span>{title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className='items-end'>
        <ThemeToggleButton />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
