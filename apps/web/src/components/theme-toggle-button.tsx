import { MoonIcon, SunIcon, SunMoonIcon } from 'lucide-react'

import { useTheme } from '#/components/theme-provider'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme()

  const label = `Toggle theme (current: ${theme})`

  return (
    <Button
      variant='outline'
      size='icon'
      aria-label={label}
      title={label}
      className='relative'
      onClick={toggleTheme}
    >
      <SunMoonIcon
        className={cn(
          'absolute h-[1.2rem] w-[1.2rem] -rotate-90 opacity-0 transition-all',
          { 'rotate-0 opacity-100': theme === 'system' },
        )}
      />
      <MoonIcon
        className={cn(
          'absolute h-[1.2rem] w-[1.2rem] rotate-90 opacity-0 transition-all',
          { 'rotate-0 opacity-100': theme === 'dark' },
        )}
      />
      <SunIcon
        className={cn(
          'h-[1.2rem] w-[1.2rem] rotate-90 opacity-0 transition-all',
          { 'rotate-0 opacity-100': theme === 'light' },
        )}
      />
    </Button>
  )
}
