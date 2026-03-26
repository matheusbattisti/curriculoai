import { useNavigate } from 'react-router-dom'
import { LogOut, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/useAuthStore'

export default function Navbar() {
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (!user) return null

  return (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5"
        onClick={() => navigate('/dashboard')}
      >
        <LayoutDashboard className="h-4 w-4" />
        <span className="hidden sm:inline">Dashboard</span>
      </Button>
      <span className="text-sm text-muted-foreground truncate max-w-[200px]">
        {user.email}
      </span>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 gap-1.5 text-destructive hover:text-destructive"
        onClick={handleSignOut}
      >
        <LogOut className="h-4 w-4" />
        <span className="hidden sm:inline">Sair</span>
      </Button>
    </div>
  )
}
