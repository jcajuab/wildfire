import type { LinkOptions } from '@tanstack/react-router'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import { Collection, Menu } from 'react-aria-components'

import { MenuItemLink } from '#/components/Link'

type SidebarLink = {
  key: string
  label: string
  to: LinkOptions['to']
  icon: IconName
}

const sidebarLinks = [
  {
    key: 'displays',
    label: 'Displays',
    to: '/admin/displays',
    icon: 'monitor',
  },
  {
    key: 'content',
    label: 'Content',
    to: '/admin/content',
    icon: 'file-image',
  },
  {
    key: 'playlists',
    label: 'Playlists',
    to: '/admin/playlists',
    icon: 'list-music',
  },
  {
    key: 'schedules',
    label: 'Schedules',
    to: '/admin/schedules',
    icon: 'calendar',
  },
] as const satisfies SidebarLink[]

export function Sidebar() {
  return (
    <nav
      aria-label='Admin sidebar'
      className='border-base-300 min-h-screen w-64 shrink-0 border-r p-4'
    >
      <Menu aria-label='Sidebar links' className='flex flex-col gap-y-2'>
        <Collection items={sidebarLinks}>
          {({ key, label, to, icon }) => (
            <MenuItemLink
              className='rounded-field text-primary data-[status=active]:bg-primary data-[status=active]:text-base-200 flex w-full items-center px-3 py-2'
              key={key}
              to={to}
            >
              <DynamicIcon aria-hidden className='mr-3 size-5' name={icon} />
              <span className='font-medium'>{label}</span>
            </MenuItemLink>
          )}
        </Collection>
      </Menu>
    </nav>
  )
}
