import { createLink } from '@tanstack/react-router'
import { MenuItem, Link as RACLink } from 'react-aria-components'

export const Link = createLink(RACLink)
export const MenuItemLink = createLink(MenuItem)
