import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  Context,
} from 'react'

export type Theme = 'light' | 'dark' | 'system'

interface ThemeContextProps {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext: Context<ThemeContextProps | undefined> = createContext<
  ThemeContextProps | undefined
>(undefined)

interface ThemeContextProviderProps {
  children: React.ReactNode
}

export const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({
  children,
}) => {
  const [systemThemeIsDark] = useState<boolean>(
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  )
  const [theme, setCurrentTheme] = useState<Theme>('system')

  const mediaQuery: MediaQueryList = window.matchMedia(
    '(prefers-color-scheme: dark)',
  )
  mediaQuery.addEventListener('change', (event: MediaQueryListEvent) => {
    const newTheme: Theme = event.matches ? 'dark' : 'light'
    setTheme(newTheme)
  })

  useEffect(() => {
    const savedTheme: string | null = localStorage.getItem('theme')
    if (savedTheme === null) {
      setTheme('system')
    } else {
      setTheme(savedTheme as Theme)
    }
  }, [])

  const setTheme = (theme: Theme): void => {
    setCurrentTheme(theme)
    localStorage.setItem('theme', theme)

    if (window.StatusBar) {
      if (theme === 'dark') {
        window.StatusBar.backgroundColorByHexString('#2b2a2a')
      } else if (theme === 'light') {
        window.StatusBar.backgroundColorByHexString('#2196f3')
      } else if (theme === 'system') {
        if (systemThemeIsDark) {
          window.StatusBar.backgroundColorByHexString('#2b2a2a')
        } else {
          window.StatusBar.backgroundColorByHexString('#2196f3')
        }
      }
    }

    if (theme === 'system') {
      if (systemThemeIsDark) {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.setAttribute('data-theme', 'light')
      }
    } else {
      document.documentElement.setAttribute('data-theme', theme)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextProps => {
  const context: ThemeContextProps | undefined = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
