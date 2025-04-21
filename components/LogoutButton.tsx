import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

const LogoutButton = () => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="px-2 py-1 text-xs font-semibold bg-[color:var(--c-bg)] text-[color:var(--c-fg)] border-[1px] border-[color:var(--c-stroke)] hover:bg-[color:var(--c-accent)] hover:text-[color:var(--c-bg)] transition-colors"
    >
      logout
    </button>
  )
}

export default LogoutButton
