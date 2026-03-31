import { useState, useEffect } from 'react'
import { Minus, Square, X, Maximize2 } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

export default function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    // 获取初始最大化状态
    window.electronAPI?.isMaximized().then(setIsMaximized)

    // 监听最大化变化
    window.electronAPI?.onMaximizedChange(setIsMaximized)
  }, [])

  const handleMinimize = () => window.electronAPI?.minimize()
  const handleMaximize = () => window.electronAPI?.maximize()
  const handleClose = () => window.electronAPI?.close()

  return (
    <header
      className="h-10 flex items-center justify-between px-4 bg-bg-secondary/50 border-b border-glass-border select-none"
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* 左侧 - 应用名称 */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-text-secondary">HAGoTVClient</span>
      </div>

      {/* 右侧 - 窗口控制按钮 */}
      <div
        className="flex items-center gap-1"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        <ThemeToggle />
        <button
          onClick={handleMinimize}
          className="w-10 h-8 flex items-center justify-center hover:bg-white/10 rounded transition-colors"
          title="最小化"
        >
          <Minus size={16} className="text-text-secondary" />
        </button>
        <button
          onClick={handleMaximize}
          className="w-10 h-8 flex items-center justify-center hover:bg-white/10 rounded transition-colors"
          title={isMaximized ? '还原' : '最大化'}
        >
          {isMaximized ? (
            <Square size={14} className="text-text-secondary" />
          ) : (
            <Maximize2 size={14} className="text-text-secondary" />
          )}
        </button>
        <button
          onClick={handleClose}
          className="w-10 h-8 flex items-center justify-center hover:bg-red-500 rounded transition-colors group"
          title="关闭"
        >
          <X size={16} className="text-text-secondary group-hover:text-white" />
        </button>
      </div>
    </header>
  )
}
