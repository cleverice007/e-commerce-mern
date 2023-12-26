import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AuthState } from '../slices/authSlice';


const PrivateRoute: React.FC = () => {
  const { userInfo } = useSelector((state: { auth: AuthState }) => state.auth);
  return userInfo ? <Outlet /> : <Navigate to='/login' replace />;
};
export default PrivateRoute;