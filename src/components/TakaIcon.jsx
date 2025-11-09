import React from 'react';

const TakaSymbol = ({ 
  className = "w-6 h-6",
  ...props 
}) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M8 2H10V4H12V6H14V8H16V10H18V12H16V14H14V16H12V18H10V20H8V18H6V16H4V14H2V12H4V10H6V8H8V6H10V4H8V2Z"/>
    </svg>
  );
};

export default TakaSymbol;