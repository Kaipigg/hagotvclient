export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  group?: UserGroup
  status: 'active' | 'banned'
  createdAt: string
  updatedAt: string
}

export interface UserGroup {
  id: string
  name: string
  nameCn: string
  description?: string
  level: number
  permissions: string[]
}

export interface TVChannel {
  id: string
  name: string
  logo?: string
  m3u8Url: string
  category: string
  status: 'active' | 'inactive'
  order: number
  createdAt: string
  updatedAt: string
}

export interface HomeSection {
  id: string
  title: string
  type: 'channels' | 'featured' | 'custom'
  content?: string
  sortOrder: number
  visible: boolean
  createdAt: string
}

export interface SystemConfig {
  key: string
  value: string
  description?: string
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
}

export interface AuthResponse {
  token: string
  user: User
}
