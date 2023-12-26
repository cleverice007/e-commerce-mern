import React from 'react';

interface MessageProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  children: React.ReactNode;
}

const Message: React.FC<MessageProps> = ({ variant = 'info', children }) => {
  return (
    <div
      className={`p-4 mb-4 rounded ${
        variant === 'primary'
          ? 'bg-blue-100 border-blue-400 text-blue-700'
          : variant === 'secondary'
          ? 'bg-gray-100 border-gray-400 text-gray-700'
          : variant === 'success'
          ? 'bg-green-100 border-green-400 text-green-700'
          : variant === 'danger'
          ? 'bg-red-100 border-red-400 text-red-700'
          : variant === 'warning'
          ? 'bg-yellow-100 border-yellow-400 text-yellow-700'
          : variant === 'info'
          ? 'bg-blue-100 border-blue-400 text-blue-700'
          : variant === 'light'
          ? 'bg-gray-100 border-gray-400 text-gray-700'
          : 'bg-black border-gray-200 text-gray-100'
      } border-l-4 shadow`}
    >
      {children}
    </div>
  );
};

export default Message;
