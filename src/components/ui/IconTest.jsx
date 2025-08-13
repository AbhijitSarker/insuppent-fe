import React from 'react';
import MaterialIcon from './MaterialIcon';

const IconTest = () => {
  const testIcons = [
    { icon: 'home', name: 'Home' },
    { icon: 'settings', name: 'Settings' },
    { icon: 'person', name: 'Person' },
    { icon: 'email', name: 'Email' },
    { icon: 'phone', name: 'Phone' },
    { icon: 'menu', name: 'Menu' },
    { icon: 'close', name: 'Close' },
    { icon: 'search', name: 'Search' },
    { icon: 'add', name: 'Add' },
    { icon: 'edit', name: 'Edit' },
    { icon: 'delete', name: 'Delete' },
    { icon: 'favorite', name: 'Favorite' },
    { icon: 'star', name: 'Star' },
    { icon: 'check', name: 'Check' },
    { icon: 'warning', name: 'Warning' },
    { icon: 'error', name: 'Error' },
    { icon: 'info', name: 'Info' },
    { icon: 'help', name: 'Help' },
    { icon: 'visibility', name: 'Visibility' },
    { icon: 'visibility_off', name: 'Visibility Off' },
  ];

  const variants = ['filled', 'outlined', 'round', 'sharp', 'two-tone'];
  const sizes = [16, 20, 24, 32, 48];

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Material Icons Test</h1>
      
      {/* Test different variants */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Icon Variants</h2>
        <div className="grid grid-cols-5 gap-4">
          {variants.map(variant => (
            <div key={variant} className="text-center p-4 border rounded-lg">
              <h3 className="font-medium mb-2 capitalize">{variant}</h3>
              <MaterialIcon icon="home" variant={variant} size={32} />
            </div>
          ))}
        </div>
      </div>

      {/* Test different sizes */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Icon Sizes</h2>
        <div className="flex items-center gap-4">
          {sizes.map(size => (
            <div key={size} className="text-center p-4 border rounded-lg">
              <div className="text-sm mb-2">{size}px</div>
              <MaterialIcon icon="star" size={size} />
            </div>
          ))}
        </div>
      </div>

      {/* Test common icons */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Common Icons</h2>
        <div className="grid grid-cols-5 gap-4">
          {testIcons.map(({ icon, name }) => (
            <div key={icon} className="text-center p-4 border rounded-lg">
              <MaterialIcon icon={icon} size={24} />
              <div className="text-sm mt-2">{name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Test with colors */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Colored Icons</h2>
        <div className="flex items-center gap-4">
          <MaterialIcon icon="favorite" size={32} className="text-red-500" />
          <MaterialIcon icon="star" size={32} className="text-yellow-500" />
          <MaterialIcon icon="check_circle" size={32} className="text-green-500" />
          <MaterialIcon icon="error" size={32} className="text-red-600" />
          <MaterialIcon icon="info" size={32} className="text-blue-500" />
          <MaterialIcon icon="warning" size={32} className="text-orange-500" />
        </div>
      </div>
    </div>
  );
};

export default IconTest; 