import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-gray text-center py-3">
      <p>E-Commerce &copy; {currentYear}</p>
    </footer>
  );
};

export default Footer;
