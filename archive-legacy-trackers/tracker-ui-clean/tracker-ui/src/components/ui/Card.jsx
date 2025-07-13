import React from 'react';

const Card = ({ children, className = "" }) => (
  <div className={`powerhouse-card ${className}`}>
    {children}
  </div>
);

export default Card;
