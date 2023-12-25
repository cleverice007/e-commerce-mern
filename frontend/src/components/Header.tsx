import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';
import { useSelector,useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { CartState } from '../slices/cartSlice';  
import {UserInfo, AuthState,logout} from '../slices/authSlice'; 
import { useLogoutMutation } from '../slices/userApiSlice';
const Header: React.FC = () => {

  const { cartItems } = useSelector((state: { cart: CartState }) => state.cart);
  const { userInfo } = useSelector((state: { auth: AuthState }) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <header className="bg-blue-500 text-white">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center flex-grow">
          <Link to="/" className="text-xl font-bold mr-4">E-commerce</Link>
          <div className="flex items-center bg-white text-gray-800 rounded">
            <input
              type="text"
              placeholder="Search..."
              className="px-2 py-1 rounded-l"
            />
            <button className="p-2 rounded-r bg-blue-500 text-white">
              <FaSearch />
            </button>
          </div>
        </div>
        <div className="flex items-center">
          <Link to="/cart" className="flex items-center mx-3 relative">
            <FaShoppingCart className="mr-1" /> Cart
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-green-500 text-xs text-white rounded-full px-2 py-1">
                {cartItems.reduce((total, item) => total + item.qty, 0)}
              </span>
            )}
          </Link>
          {userInfo ? (
            <div className="relative">
              <button className="flex items-center mx-3">
                <FaUser className="mr-1" /> {userInfo.name}
              </button>
              <div className="absolute right-0 bg-white text-gray-800 rounded shadow-lg mt-2 py-1">
                <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                <button onClick={logoutHandler} className="block px-4 py-2 hover:bg-gray-100 text-left w-full">Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="flex items-center mx-3">
              <FaUser className="mr-1" /> Sign In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;


