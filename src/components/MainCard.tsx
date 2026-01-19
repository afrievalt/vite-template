import React from 'react';

interface MainCardProps {
  children: React.ReactNode;
  className?: string;
}

export const MainCard: React.FC<MainCardProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`mb-4 border-y border-gray-200 bg-white p-4 shadow-none sm:mb-6 sm:rounded-lg sm:border-none sm:p-6 sm:shadow-md ${className}`}
    >
      {children}
    </div>
  );
};

export default MainCard;
