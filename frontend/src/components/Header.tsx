import React from 'react';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-500 text-white">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center flex-grow">
          <a href="/" className="text-xl font-bold mr-4">E-commerce</a>
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
          <a href="/cart" className="flex items-center mx-3">
            <FaShoppingCart className="mr-1" /> Cart
          </a>
          <a href="/login" className="flex items-center">
            <FaUser className="mr-1" /> Sign In
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;


