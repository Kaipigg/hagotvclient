import { Moon, Sun } from 'lucide-react'
import { useThemeStore } from '../../stores/themeStore'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeStore()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg transition-colors hover:bg-white/10 text-text-secondary hover:text-text-primary"
      title={isDark ? '切换到亮色模式' : '切换到暗色模式'}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}