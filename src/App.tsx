
import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import HomePage from '@/pages/HomePage'
import ProfilePage from '@/pages/ProfilePage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import NotFoundPage from '@/pages/NotFoundPage'
import MessagesPage from '@/pages/MessagesPage'
import NotificationsPage from '@/pages/NotificationsPage'
import GroupsPage from '@/pages/GroupsPage'
import Layout from '@/components/layout/Layout'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="social-theme">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <Toaster />
    </ThemeProvider>
  )
}

export default App
