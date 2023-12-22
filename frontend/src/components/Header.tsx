import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { CartState } from '../slices/cartSlice';  
const Header: React.FC = () => {
  const { cartItems } = useSelector((state: { cart: CartState }) => state.cart);

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
          <Link to="/login" className="flex items-center">
            <FaUser className="mr-1" /> Sign In
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;


