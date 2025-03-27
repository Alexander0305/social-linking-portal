
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const contacts = [
  { id: 1, name: 'Alex Johnson', avatar: 'AJ', status: 'online' },
  { id: 2, name: 'Maria Garcia', avatar: 'MG', status: 'online' },
  { id: 3, name: 'John Smith', avatar: 'JS', status: 'offline' },
  { id: 4, name: 'Sarah Wilson', avatar: 'SW', status: 'online' },
  { id: 5, name: 'David Brown', avatar: 'DB', status: 'offline' }
]

const trendingTopics = [
  '#technology',
  '#travel',
  '#photography',
  '#music',
  '#food'
]

const RightSidebar = () => {
  return (
    <aside className="hidden xl:flex flex-col w-72 border-l p-4 pt-16 h-screen sticky top-0">
      <div className="mb-6">
        <h3 className="font-medium mb-3">Trending Topics</h3>
        <div className="space-y-2">
          {trendingTopics.map((topic, index) => (
            <div key={index} className="text-sm hover:text-primary cursor-pointer">
              {topic}
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="font-medium mb-3">Online Friends</h3>
        <div className="space-y-3">
          {contacts.map((contact) => (
            <Link to={`/profile/${contact.id}`} key={contact.id} className="flex items-center gap-2 hover:bg-muted p-2 rounded-md">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" alt={contact.name} />
                  <AvatarFallback>{contact.avatar}</AvatarFallback>
                </Avatar>
                {contact.status === 'online' && (
                  <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-1 ring-background"></span>
                )}
              </div>
              <span className="text-sm">{contact.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default RightSidebar
