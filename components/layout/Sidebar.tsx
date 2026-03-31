import { NavLink } from 'react-router-dom'
import { Home, Tv, User, Settings, LogOut, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../stores/authStore'
import clsx from 'clsx'

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/tv', icon: Tv, label: '直播' },
  { path: '/profile', icon: User, label: '个人中心' },
]

const adminItems = [
  { path: '/admin', icon: Shield, label: '管理后台' },
]

export default function Sidebar() {
  const { user, logout } = useAuthStore()
  const isAdmin = user?.group?.level && user.group.level >= 10

  return (
    <aside className="w-64 glass border-r border-glass-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-glass-border">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
          HAGo
        </h1>
        <p className="text-xs text-text-muted mt-1">HAGoTVClient</p>
      </div>

      {/* 导航 */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavItem key={item.path} {...item} />
        ))}

        {isAdmin && (
          <>
            <div className="my-4 border-t border-glass-border" />
            {adminItems.map((item) => (
              <NavItem key={item.path} {...item} />
            ))}
          </>
        )}
      </nav>

      {/* 用户信息 */}
      <div className="p-4 border-t border-glass-border">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.username}</p>
              <p className="text-xs text-text-muted truncate">{user.group?.nameCn || '用户'}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="退出登录"
            >
              <LogOut size={18} className="text-text-muted" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <NavLink
              to="/login"
              className={clsx(
                'block w-full py-2 text-center rounded-xl transition-colors',
                'bg-primary hover:bg-primary-hover text-white'
              )}
            >
              登录
            </NavLink>
            <NavLink
              to="/register"
              className={clsx(
                'block w-full py-2 text-center rounded-xl transition-colors',
                'glass hover:bg-white/20'
              )}
            >
              注册
            </NavLink>
          </div>
        )}
      </div>
    </aside>
  )
}

function NavItem({ path, icon: Icon, label }: { path: string; icon: React.ElementType; label: string }) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        clsx(
          'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
          isActive
            ? 'bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary border-l-2 border-primary'
            : 'text-text-secondary hover:bg-white/10 hover:text-text-primary'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="nav-indicator"
              className="absolute left-0 w-1 h-8 bg-primary rounded-r-full"
            />
          )}
          <Icon size={20} />
          <span className="font-medium">{label}</span>
        </>
      )}
    </NavLink>
  )
}
