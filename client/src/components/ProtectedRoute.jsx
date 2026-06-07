import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      height: '100vh', fontSize: '16px', color: '#7F77DD'
    }}>
      Loading...
    </div>
  );

  return user ? children : <Navigate to="/auth" />;
}