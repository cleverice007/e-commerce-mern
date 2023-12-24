import React, { ReactNode } from 'react';

interface FormContainerProps {
  children: ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({ children }) => {
  return (
    <div className="container mx-auto">
      <div className="flex justify-center">
        <div className="w-full md:w-1/2">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormContainer;
