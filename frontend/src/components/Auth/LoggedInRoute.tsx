import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const LoggedInRoute = () => {
  const isAuthenticated = useAuth();

  if (isAuthenticated === null) {
    // Auth state is not determined yet
    // Render null or some loading indicator
    return null;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default LoggedInRoute;