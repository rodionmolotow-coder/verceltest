import React from 'react';

const LoadingDots: React.FC = () => {
  return (
    <div className="flex space-x-1.5 p-2 items-center">
      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
    </div>
  );
};

export default LoadingDots;