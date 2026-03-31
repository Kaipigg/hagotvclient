import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, Tv, Settings, Shield, Plus, Edit, Trash2, Search, ChevronRight, UserCheck, UserX, Save, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { userApi, channelApi, groupApi } from '../../services/api'
import type { User, TVChannel, UserGroup } from '../../types'

type TabType = 'users' | 'channels' | 'groups' | 'settings'

const tabs = [
  { id: 'users', label: '用户管理', icon: Users },
  { id: 'channels', label: '频道管理', icon: Tv },
  { id: 'groups', label: '用户组', icon: Shield },
  { id: 'settings', label: '系统设置', icon: Settings },
]

export default function Admin() {
  const [activeTab, setActiveTab] = useState<TabType>('users')
  const [loading, setLoading] = useState(false)

  return (
    <div className="h-full flex gap-6">
      {/* 侧边栏 */}
      <div className="w-56 glass rounded-2xl p-4">
        <h2 className="text-lg font-semibold mb-4 px-2">管理后台</h2>
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary/20 to-purple-500/20 text-primary border-l-2 border-primary'
                  : 'text-text-secondary hover:bg-white/10'
              }`}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* 主内容 */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'users' && <UsersPanel key="users" />}
          {activeTab === 'channels' && <ChannelsPanel key="channels" />}
          {activeTab === 'groups' && <GroupsPanel key="groups" />}
          {activeTab === 'settings' && <SettingsPanel key="settings" />}
        </AnimatePresence>
      </div>
    </div>
  )
}

// 用户管理面板
function UsersPanel() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await userApi.getUsers()
      if (response.success) {
        setUsers(response.data?.users || [])
      }
    } catch (error) {
      toast.error('加载用户失败')
    } finally {
      setLoading(false)
    }
  }

  const handleBan = async (userId: string, banned: boolean) => {
    try {
      await userApi.banUser(userId, banned)
      toast.success(banned ? '已封禁用户' : '已解封用户')
      loadUsers()
    } catch (error) {
      toast.error('操作失败')
    }
  }

  const filteredUsers = users.filter(u => 
    u.username.includes(search) || u.email.includes(search)
  )

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">用户管理</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-glass pl-10 w-64"
            placeholder="搜索用户..."
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-glass-border">
            <tr>
              <th className="text-left p-4 text-text-secondary font-medium">用户</th>
              <th className="text-left p-4 text-text-secondary font-medium">邮箱</th>
              <th className="text-left p-4 text-text-secondary font-medium">用户组</th>
              <th className="text-left p-4 text-text-secondary font-medium">状态</th>
              <th className="text-left p-4 text-text-secondary font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-glass-border">
                  <td colSpan={5} className="p-4"><div className="h-6 skeleton rounded" /></td>
                </tr>
              ))
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-glass-border hover:bg-white/5">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{user.username}</span>
                    </div>
                  </td>
                  <td className="p-4 text-text-secondary">{user.email}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-primary/20 text-primary rounded text-sm">
                      {user.group?.nameCn || '用户'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      user.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {user.status === 'active' ? '正常' : '已封禁'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleBan(user.id, user.status === 'active')}
                        className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${
                          user.status === 'active' ? 'text-red-400' : 'text-green-400'
                        }`}
                        title={user.status === 'active' ? '封禁' : '解封'}
                      >
                        {user.status === 'active' ? <UserX size={18} /> : <UserCheck size={18} />}
                      </button>
                      <button className="p-2 rounded-lg hover:bg-white/10 text-text-muted">
                        <Edit size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}

// 频道管理面板
function ChannelsPanel() {
  const [channels, setChannels] = useState<TVChannel[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingChannel, setEditingChannel] = useState<TVChannel | null>(null)
  const [form, setForm] = useState({
    name: '',
    m3u8Url: '',
    category: '',
    status: 'active',
  })

  useEffect(() => {
    loadChannels()
  }, [])

  const loadChannels = async () => {
    try {
      const response = await channelApi.getChannels()
      if (response.success) {
        setChannels(response.data || [])
      }
    } catch (error) {
      toast.error('加载频道失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingChannel) {
        await channelApi.updateChannel(editingChannel.id, form)
        toast.success('更新成功')
      } else {
        await channelApi.createChannel(form)
        toast.success('创建成功')
      }
      setShowModal(false)
      setEditingChannel(null)
      setForm({ name: '', m3u8Url: '', category: '', status: 'active' })
      loadChannels()
    } catch (error) {
      toast.error('操作失败')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (channel: TVChannel) => {
    setEditingChannel(channel)
    setForm({
      name: channel.name,
      m3u8Url: channel.m3u8Url,
      category: channel.category,
      status: channel.status,
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除此频道？')) return
    try {
      await channelApi.deleteChannel(id)
      toast.success('删除成功')
      loadChannels()
    } catch (error) {
      toast.error('删除失败')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">频道管理</h3>
        <button
          onClick={() => {
            setEditingChannel(null)
            setForm({ name: '', m3u8Url: '', category: '', status: 'active' })
            setShowModal(true)
          }}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          添加频道
        </button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-4 skeleton h-20" />
          ))
        ) : (
          channels.map((channel) => (
            <div key={channel.id} className="glass-card p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                <span className="text-2xl">📺</span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{channel.name}</h4>
                <p className="text-sm text-text-muted truncate">{channel.m3u8Url}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded">
                    {channel.category}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    channel.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {channel.status === 'active' ? '启用' : '禁用'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(channel)}
                  className="p-2 rounded-lg hover:bg-white/10 text-text-muted"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(channel.id)}
                  className="p-2 rounded-lg hover:bg-white/10 text-red-400"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 添加/编辑弹窗 */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass-card p-6 w-full max-w-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  {editingChannel ? '编辑频道' : '添加频道'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    频道名称
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input-glass"
                    placeholder="请输入频道名称"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    M3U8 地址
                  </label>
                  <input
                    type="url"
                    value={form.m3u8Url}
                    onChange={(e) => setForm({ ...form, m3u8Url: e.target.value })}
                    className="input-glass"
                    placeholder="https://example.com/live.m3u8"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    分类
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="input-glass"
                    placeholder="如：体育、新闻、综艺"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    状态
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="input-glass"
                  >
                    <option value="active">启用</option>
                    <option value="inactive">禁用</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary"
                  >
                    取消
                  </button>
                  <button type="submit" className="btn-primary flex items-center gap-2">
                    <Save size={20} />
                    保存
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// 用户组管理面板
function GroupsPanel() {
  const [groups, setGroups] = useState<UserGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    try {
      const response = await groupApi.getGroups()
      if (response.success) {
        setGroups(response.data || [])
      }
    } catch (error) {
      toast.error('加载用户组失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">用户组管理</h3>
        <button className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          添加用户组
        </button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-4 skeleton h-24" />
          ))
        ) : (
          groups.map((group) => (
            <div key={group.id} className="glass-card p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
                <Shield className="text-primary" size={24} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{group.nameCn}</h4>
                <p className="text-sm text-text-muted">{group.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded">
                    等级: {group.level}
                  </span>
                  <span className="text-xs text-text-muted">
                    权限数: {group.permissions?.length || 0}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-white/10 text-text-muted">
                  <Edit size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  )
}

// 系统设置面板
function SettingsPanel() {
  const [config, setConfig] = useState({
    siteName: 'HAGoTVClient',
    serverUrl: 'http://localhost:3001',
    maxUsers: '1000',
  })

  const handleSave = () => {
    toast.success('设置已保存')
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <h3 className="text-xl font-semibold">系统设置</h3>

      <div className="glass-card p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            网站名称
          </label>
          <input
            type="text"
            value={config.siteName}
            onChange={(e) => setConfig({ ...config, siteName: e.target.value })}
            className="input-glass"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            API 服务器地址
          </label>
          <input
            type="url"
            value={config.serverUrl}
            onChange={(e) => setConfig({ ...config, serverUrl: e.target.value })}
            className="input-glass"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-secondary mb-2">
            最大用户数
          </label>
          <input
            type="number"
            value={config.maxUsers}
            onChange={(e) => setConfig({ ...config, maxUsers: e.target.value })}
            className="input-glass"
          />
        </div>

        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          <Save size={20} />
          保存设置
        </button>
      </div>
    </motion.div>
  )
}
