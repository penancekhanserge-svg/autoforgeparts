import NotificationMessage from '../../components/NotificationMessage'
import { Link, Navigate } from 'react-router-dom'
import { useAdminSession } from '../../hooks/useAdminSession'
export default function RequireAdmin({children}) {
 const {loading,user,error}=useAdminSession()
 if(loading)return <main className="merchant-auth"><p role="status">Verifying admin access...</p></main>
 if(error)return <main className="merchant-auth"><h1>Unable to verify access</h1><NotificationMessage message={error} /><Link to="/admin/login" state={{ adminLoginEntry: true }}>Return to login</Link></main>
 if(!user)return <Navigate to="/" replace />
 if(user.app_metadata?.role!=='admin')return <Navigate to="/" replace />
 return children
}
