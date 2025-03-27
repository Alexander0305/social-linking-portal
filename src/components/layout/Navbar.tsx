
import { Link } from 'react-router-dom'
import { Bell, Home, Menu, MessageSquare, Search, User, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ModeToggle } from '@/components/ui/mode-toggle'

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 border-b bg-background z-30 flex items-center px-4 md:px-6">
      <div className="flex items-center w-full">
        <div className="flex items-center mr-4">
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-bold text-primary">SocialApp</h1>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-8 rounded-full bg-muted"
            />
          </div>
        </div>

        <div className="flex items-center ml-auto gap-4">
          <nav className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/">
                <Home className="h-5 w-5" />
                <span className="sr-only">Home</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/messages">
                <MessageSquare className="h-5 w-5" />
                <span className="sr-only">Messages</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/notifications">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/groups">
                <Users className="h-5 w-5" />
                <span className="sr-only">Groups</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link to="/profile/me">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Link>
            </Button>
          </nav>

          <ModeToggle />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-4 mt-8">
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/">
                    <Home className="h-5 w-5 mr-2" />
                    Home
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/messages">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Messages
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/notifications">
                    <Bell className="h-5 w-5 mr-2" />
                    Notifications
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/groups">
                    <Users className="h-5 w-5 mr-2" />
                    Groups
                  </Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/profile/me">
                    <User className="h-5 w-5 mr-2" />
                    Profile
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default Navbar
