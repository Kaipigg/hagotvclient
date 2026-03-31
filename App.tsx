import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/layout/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import TV from './pages/TV'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import { useAuthStore } from './stores/authStore'
import { useThemeStore } from './stores/themeStore'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore()
  const isAdmin = user?.group?.level && user.group.level >= 10
  return isAdmin ? <>{children}</> : <Navigate to="/" />
}

function App() {
  const { isDark } = useThemeStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tv" element={<TV />} />
          <Route path="/profile" element={
            <PrivateRoute><Profile /></PrivateRoute>
          } />
          <Route path="/admin" element={
            <PrivateRoute>
              <AdminRoute><Admin /></AdminRoute>
            </PrivateRoute>
          } />
        </Route>
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(30, 41, 59, 0.9)',
            color: '#F8FAFC',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
    </BrowserRouter>
  )
}

export default App
