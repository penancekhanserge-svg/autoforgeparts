import { Link, Navigate } from 'react-router-dom'
import { useAdminSession } from '../../hooks/useAdminSession'
import { supabase } from '../../lib/supabase'
export default function RequireAdmin({children}) {
 const {loading,user,error}=useAdminSession()
 if(loading)return <main className="merchant-auth"><p role="status">Verifying admin access...</p></main>
 if(error)return <main className="merchant-auth"><h1>Unable to verify access</h1><p role="alert">{error}</p><Link to="/admin/login">Return to login</Link></main>
 if(!user)return <Navigate to="/admin/login" replace />
 if(user.app_metadata?.role!=='admin')return <main className="merchant-auth"><h1>Admin access required</h1><p>This account does not have the admin role.</p><button onClick={()=>supabase.auth.signOut({scope:'local'})}>Sign out</button></main>
 return children
}
