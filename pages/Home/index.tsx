import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, ChevronRight, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { channelApi } from '../../services/api'
import type { TVChannel } from '../../types'

export default function Home() {
  const navigate = useNavigate()
  const [featuredChannels, setFeaturedChannels] = useState<TVChannel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChannels()
  }, [])

  const loadChannels = async () => {
    try {
      const response = await channelApi.getChannels({ status: 'active' })
      if (response.success) {
        setFeaturedChannels(response.data?.slice(0, 6) || [])
      }
    } catch (error) {
      console.error('Failed to load channels:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* 欢迎横幅 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/30 to-purple-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">
            欢迎使用 <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">HAGoTVClient</span>
          </h2>
          <p className="text-text-secondary mb-6">体验流畅的电视直播服务</p>
          <button
            onClick={() => navigate('/tv')}
            className="btn-primary flex items-center gap-2"
          >
            <Play size={20} />
            开始观看
          </button>
        </div>
      </motion.div>

      {/* 快捷入口 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: '电视直播', desc: '观看高清直播', icon: '📺', path: '/tv' },
          { title: '个人中心', desc: '管理个人资料', icon: '👤', path: '/profile' },
          { title: '管理后台', desc: '系统管理', icon: '⚙️', path: '/admin' },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate(item.path)}
            className="glass-card p-6 cursor-pointer hover:scale-[1.02] transition-transform"
          >
            <div className="text-4xl mb-3">{item.icon}</div>
            <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
            <p className="text-text-secondary text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* 热门频道 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="text-primary" size={20} />
            热门频道
          </h3>
          <button
            onClick={() => navigate('/tv')}
            className="text-primary hover:underline flex items-center gap-1"
          >
            查看更多 <ChevronRight size={16} />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-4 skeleton h-40" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredChannels.map((channel, index) => (
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate('/tv')}
                className="glass-card p-4 cursor-pointer hover:scale-[1.02] transition-transform group"
              >
                <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center mb-3">
                  <span className="text-4xl">📺</span>
                </div>
                <h4 className="font-medium truncate group-hover:text-primary transition-colors">
                  {channel.name}
                </h4>
                <p className="text-xs text-text-muted truncate">{channel.category}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
