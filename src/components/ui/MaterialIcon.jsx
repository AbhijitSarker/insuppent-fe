import React from 'react';
import { cn } from '../../lib/utils';

const MaterialIcon = ({ 
  icon, 
  variant = 'filled', 
  size = 24, 
  className, 
  ...props 
}) => {
  const getIconClass = () => {
    switch (variant) {
      case 'filled':
        return 'material-icons';
      case 'outlined':
        return 'material-icons-outlined';
      case 'round':
        return 'material-icons-round';
      case 'sharp':
        return 'material-icons-sharp';
      case 'two-tone':
        return 'material-icons-two-tone';
      default:
        return 'material-icons';
    }
  };

  return (
    <span
      className={cn(
        getIconClass(),
        'select-none',
        className
      )}
      style={{ fontSize: size }}
      {...props}
    >
      {icon}
    </span>
  );
};

export default MaterialIcon; 