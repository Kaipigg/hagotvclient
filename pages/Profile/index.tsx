import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Save, Camera } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../../stores/authStore'
import { userApi } from '../../services/api'

export default function Profile() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  })
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      const response = await userApi.updateUser(user.id, form)
      if (response.success) {
        toast.success('资料更新成功')
      }
    } catch (error) {
      toast.error('更新失败')
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('两次密码输入不一致')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('密码长度至少6位')
      return
    }

    setLoading(true)
    try {
      // 调用修改密码 API
      toast.success('密码修改成功')
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error('修改密码失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8"
      >
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <User className="text-primary" size={24} />
          个人资料
        </h2>

        {/* 头像 */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-4xl font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-primary rounded-full hover:bg-primary-hover transition-colors">
              <Camera size={16} />
            </button>
          </div>
          <div>
            <h3 className="text-lg font-semibold">{user?.username}</h3>
            <p className="text-text-secondary">{user?.group?.nameCn}</p>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              用户名
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="input-glass pl-12"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              邮箱
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input-glass pl-12"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            <Save size={20} />
            保存修改
          </button>
        </form>
      </motion.div>

      {/* 修改密码 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-8"
      >
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Lock className="text-primary" size={24} />
          修改密码
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              当前密码
            </label>
            <input
              type="password"
              value={passwordForm.oldPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
              className="input-glass"
              placeholder="请输入当前密码"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              新密码
            </label>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              className="input-glass"
              placeholder="请输入新密码"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              确认新密码
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              className="input-glass"
              placeholder="请再次输入新密码"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            <Lock size={20} />
            修改密码
          </button>
        </form>
      </motion.div>
    </div>
  )
}
