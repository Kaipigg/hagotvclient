import { useEffect, useState, useRef } from 'react'
import Hls from 'hls.js'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, ChevronLeft } from 'lucide-react'
import { channelApi } from '../../services/api'
import { useTVStore } from '../../stores/tvStore'
import type { TVChannel } from '../../types'

export default function TV() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('全部')
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<string>('全部')
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  const { channels, currentChannel, setChannels, setCurrentChannel } = useTVStore()

  useEffect(() => {
    loadChannels()
  }, [])

  useEffect(() => {
    if (currentChannel && videoRef.current) {
      loadStream(currentChannel)
    }
  }, [currentChannel])

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement || !!(document as any).webkitFullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
    }
  }, [])

  const loadChannels = async () => {
    try {
      const response = await channelApi.getChannels({ status: 'active' })
      if (response.success) {
        setChannels(response.data || [])
        const cats = ['全部', ...new Set(response.data?.map((c: TVChannel) => c.category).filter(Boolean) || [])]
        setCategories(cats)
        if (response.data?.length > 0) {
          setCurrentChannel(response.data[0])
        }
      }
    } catch (error) {
      console.error('Failed to load channels:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadStream = (channel: TVChannel) => {
    if (!videoRef.current) return

    if (hlsRef.current) {
      hlsRef.current.destroy()
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      })
      hls.loadSource(channel.m3u8Url)
      hls.attachMedia(videoRef.current)
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current?.play().catch(console.error)
      })
      hlsRef.current = hls
    } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      videoRef.current.src = channel.m3u8Url
      videoRef.current.addEventListener('loadedmetadata', () => {
        videoRef.current?.play().catch(console.error)
      })
    }
  }

  const filteredChannels = selectedCategory === '全部'
    ? channels
    : channels.filter(c => c.category === selectedCategory)

  const toggleFullscreen = () => {
    if (!videoRef.current) return
    
    if (!document.fullscreenElement) {
      // 视频全屏 - 使用 video 元素的全屏 API
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen()
      } else if (videoRef.current.webkitRequestFullscreen) {
        // Safari
        videoRef.current.webkitRequestFullscreen()
      }
    } else {
      document.exitFullscreen()
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(videoRef.current.muted)
    }
  }

  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }

  return (
    <div className="h-full flex gap-6">
      {/* 频道列表 */}
      <div className="w-80 flex flex-col glass rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-glass-border">
          <h2 className="text-lg font-semibold mb-3">频道列表</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-glass hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-2">
          {loading ? (
            <div className="space-y-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="p-3 rounded-xl skeleton" />
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              <AnimatePresence>
                {filteredChannels.map((channel) => (
                  <motion.div
                    key={channel.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setCurrentChannel(channel)}
                    className={`p-3 rounded-xl cursor-pointer transition-all ${
                      currentChannel?.id === channel.id
                        ? 'bg-gradient-to-r from-primary/20 to-purple-500/20 border-l-2 border-primary'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                        <span className="text-lg">📺</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{channel.name}</p>
                        <p className="text-xs text-text-muted truncate">{channel.category}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* 播放器 */}
      <div className="flex-1 flex flex-col">
        {/* 视频区域 */}
        <div
          className="flex-1 relative bg-black rounded-2xl overflow-hidden group"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
        >
          <video
            ref={videoRef}
            className="w-full h-full object-contain"
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onClick={() => {
              if (videoRef.current) {
                if (videoRef.current.paused) {
                  videoRef.current.play()
                } else {
                  videoRef.current.pause()
                }
              }
            }}
          />

          {/* 顶部信息栏 */}
          <AnimatePresence>
            {showControls && currentChannel && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{currentChannel.name}</h3>
                    <p className="text-sm text-text-secondary">{currentChannel.category}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 播放控制栏 */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => videoRef.current?.paused ? videoRef.current?.play() : videoRef.current?.pause()}
                      className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    <button onClick={toggleMute} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                      {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                      <Settings size={24} />
                    </button>
                    <button onClick={toggleFullscreen} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                      {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 空状态 */}
          {!currentChannel && !loading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📺</div>
                <p className="text-text-secondary">请选择频道开始观看</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
