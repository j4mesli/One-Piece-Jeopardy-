import { Outlet } from 'react-router-dom';
import RequireAuth from './RequireAuth';

const ProtectedRoutes = () => {
  return (
    <RequireAuth>
      <Outlet />
    </RequireAuth>
  );
};

export default ProtectedRoutes;
