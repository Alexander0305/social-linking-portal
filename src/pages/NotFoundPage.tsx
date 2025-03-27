
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">Page not found</p>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link to="/">
          Return Home
        </Link>
      </Button>
    </div>
  )
}

export default NotFoundPage
