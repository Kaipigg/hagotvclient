import axios, { AxiosError } from 'axios'
import type { ApiResponse, LoginRequest, RegisterRequest, AuthResponse, User, TVChannel, HomeSection, UserGroup } from '../types'
import { useAuthStore } from '../stores/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
})

// 请求拦截器 - 添加 Token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
api.interceptors.response.use(
  (response) => response.data,
  (error: AxiosError<ApiResponse>) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

// 认证 API
export const authApi = {
  login: (data: LoginRequest) => api.post<ApiResponse<AuthResponse>>('/auth/login', data),
  register: (data: RegisterRequest) => api.post<ApiResponse<AuthResponse>>('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get<ApiResponse<User>>('/auth/me'),
  sendVerifyCode: (email: string, type: 'register' | 'reset_password') =>
    api.post('/auth/send-code', { email, type }),
  resetPassword: (email: string, code: string, password: string) =>
    api.post('/auth/reset-password', { email, code, password }),
}

// 用户 API
export const userApi = {
  getUsers: (params?: { page?: number; limit?: number; groupId?: string }) =>
    api.get<ApiResponse<{ users: User[]; total: number }>>('/users', { params }),
  getUser: (id: string) => api.get<ApiResponse<User>>(`/users/${id}`),
  updateUser: (id: string, data: Partial<User>) => api.put<ApiResponse<User>>(`/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
  banUser: (id: string, banned: boolean) => api.post(`/users/${id}/ban`, { banned }),
}

// 用户组 API
export const groupApi = {
  getGroups: () => api.get<ApiResponse<UserGroup[]>>('/groups'),
  createGroup: (data: Partial<UserGroup>) => api.post<ApiResponse<UserGroup>>('/groups', data),
  updateGroup: (id: string, data: Partial<UserGroup>) => api.put<ApiResponse<UserGroup>>(`/groups/${id}`, data),
  deleteGroup: (id: string) => api.delete(`/groups/${id}`),
}

// TV 频道 API
export const channelApi = {
  getChannels: (params?: { category?: string; status?: string }) =>
    api.get<ApiResponse<TVChannel[]>>('/channels', { params }),
  getChannel: (id: string) => api.get<ApiResponse<TVChannel>>(`/channels/${id}`),
  createChannel: (data: Partial<TVChannel>) => api.post<ApiResponse<TVChannel>>('/channels', data),
  updateChannel: (id: string, data: Partial<TVChannel>) => api.put<ApiResponse<TVChannel>>(`/channels/${id}`, data),
  deleteChannel: (id: string) => api.delete(`/channels/${id}`),
  reorderChannels: (ids: string[]) => api.post('/channels/reorder', { ids }),
}

// 首页板块 API
export const sectionApi = {
  getSections: () => api.get<ApiResponse<HomeSection[]>>('/sections'),
  createSection: (data: Partial<HomeSection>) => api.post<ApiResponse<HomeSection>>('/sections', data),
  updateSection: (id: string, data: Partial<HomeSection>) => api.put<ApiResponse<HomeSection>>(`/sections/${id}`, data),
  deleteSection: (id: string) => api.delete(`/sections/${id}`),
}

// 系统配置 API
export const configApi = {
  getConfig: (key: string) => api.get<ApiResponse<{ key: string; value: string }>>(`/config/${key}`),
  setConfig: (key: string, value: string) => api.put<ApiResponse>('/config', { key, value }),
  getAllConfig: () => api.get<ApiResponse<Record<string, string>>>('/config'),
}

export default api
