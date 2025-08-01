import { createContext, useContext, useEffect } from 'react'
import { type TernaryDarkMode, useTernaryDarkMode } from 'usehooks-ts'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: TernaryDarkMode
  storageKey?: string
}

type ThemeProviderState = {
  theme: TernaryDarkMode
  setTheme: (theme: TernaryDarkMode) => void
  toggleTheme: () => void
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined,
)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'theme',
}: ThemeProviderProps) {
  const {
    isDarkMode,
    ternaryDarkMode,
    setTernaryDarkMode,
    toggleTernaryDarkMode,
  } = useTernaryDarkMode({
    defaultValue: defaultTheme,
    localStorageKey: storageKey,
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', isDarkMode)
    root.classList.toggle('light', !isDarkMode)
  }, [isDarkMode])

  const value: ThemeProviderState = {
    theme: ternaryDarkMode,
    setTheme: setTernaryDarkMode,
    toggleTheme: toggleTernaryDarkMode,
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
