
import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthProvider } from '@/contexts/AuthContext'
import { DataProvider } from '@/contexts/DataContext'
import HomePage from '@/pages/HomePage'
import ProfilePage from '@/pages/ProfilePage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import NotFoundPage from '@/pages/NotFoundPage'
import MessagesPage from '@/pages/MessagesPage'
import NotificationsPage from '@/pages/NotificationsPage'
import GroupsPage from '@/pages/GroupsPage'
import Layout from '@/components/layout/Layout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import MarketplacePage from '@/pages/MarketplacePage'
import EventsPage from '@/pages/EventsPage'
import BlogsPage from '@/pages/BlogsPage'
import ForumsPage from '@/pages/ForumsPage'
import PagesDirectoryPage from '@/pages/PagesDirectoryPage'
import StoriesPage from '@/pages/StoriesPage'
import SearchPage from '@/pages/SearchPage'
import SettingsPage from '@/pages/SettingsPage'
import GroupDetailPage from '@/pages/GroupDetailPage'
import PageDetailPage from '@/pages/PageDetailPage'
import EventDetailPage from '@/pages/EventDetailPage'
import ProductDetailPage from '@/pages/ProductDetailPage'
import BlogPostPage from '@/pages/BlogPostPage'
import ForumThreadPage from '@/pages/ForumThreadPage'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="social-theme">
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/profile/:id" element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } />
              <Route path="/messages" element={
                <ProtectedRoute>
                  <MessagesPage />
                </ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              } />
              <Route path="/groups" element={
                <ProtectedRoute>
                  <GroupsPage />
                </ProtectedRoute>
              } />
              <Route path="/groups/:id" element={
                <ProtectedRoute>
                  <GroupDetailPage />
                </ProtectedRoute>
              } />
              <Route path="/pages" element={
                <ProtectedRoute>
                  <PagesDirectoryPage />
                </ProtectedRoute>
              } />
              <Route path="/pages/:id" element={
                <ProtectedRoute>
                  <PageDetailPage />
                </ProtectedRoute>
              } />
              <Route path="/marketplace" element={
                <ProtectedRoute>
                  <MarketplacePage />
                </ProtectedRoute>
              } />
              <Route path="/marketplace/:id" element={
                <ProtectedRoute>
                  <ProductDetailPage />
                </ProtectedRoute>
              } />
              <Route path="/events" element={
                <ProtectedRoute>
                  <EventsPage />
                </ProtectedRoute>
              } />
              <Route path="/events/:id" element={
                <ProtectedRoute>
                  <EventDetailPage />
                </ProtectedRoute>
              } />
              <Route path="/blogs" element={
                <ProtectedRoute>
                  <BlogsPage />
                </ProtectedRoute>
              } />
              <Route path="/blogs/:id" element={
                <ProtectedRoute>
                  <BlogPostPage />
                </ProtectedRoute>
              } />
              <Route path="/forums" element={
                <ProtectedRoute>
                  <ForumsPage />
                </ProtectedRoute>
              } />
              <Route path="/forums/:id" element={
                <ProtectedRoute>
                  <ForumThreadPage />
                </ProtectedRoute>
              } />
              <Route path="/stories" element={
                <ProtectedRoute>
                  <StoriesPage />
                </ProtectedRoute>
              } />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
          <Toaster />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
