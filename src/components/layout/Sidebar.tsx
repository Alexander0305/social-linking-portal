
import { Link } from 'react-router-dom'
import { User, Users, Image, Video, Calendar, Bookmark, Heart, Settings, MessageSquare, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

const Sidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col w-64 border-r p-4 pt-16 h-screen sticky top-0">
      <nav className="space-y-2 mt-6">
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/">
            <Users className="mr-2 h-4 w-4" />
            Feed
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/profile/me">
            <User className="mr-2 h-4 w-4" />
            My Profile
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/messages">
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/groups">
            <Users className="mr-2 h-4 w-4" />
            Groups
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/photos">
            <Image className="mr-2 h-4 w-4" />
            Photos
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/videos">
            <Video className="mr-2 h-4 w-4" />
            Videos
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/events">
            <Calendar className="mr-2 h-4 w-4" />
            Events
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/saved">
            <Bookmark className="mr-2 h-4 w-4" />
            Saved Posts
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/liked">
            <Heart className="mr-2 h-4 w-4" />
            Liked Posts
          </Link>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <Link to="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </Button>
      </nav>
    </aside>
  )
}

export default Sidebar
