import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { axiosSecure } from '@/api/axios/config';

const BrandColorContext = createContext({
  brandColor: '#2563EB',
  setBrandColor: () => {},
});

export const useBrandColor = () => useContext(BrandColorContext);

export const BrandColorProvider = ({ children }) => {
  const [brandColor, setBrandColor] = useState('#2563EB');

  useEffect(() => {
    const fetchBrandColor = async () => {
      try {
        const res = await axiosSecure.get('/settings/brand-color');
        setBrandColor(res.data.brandColor || '#2563EB');
        document.documentElement.style.setProperty('--brand-color', res.data.brandColor || '#2563EB');
      } catch {
        setBrandColor('#2563EB');
        document.documentElement.style.setProperty('--brand-color', '#2563EB');
      }
    };
    fetchBrandColor();
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--brand-color', brandColor);
  }, [brandColor]);

  return (
    <BrandColorContext.Provider value={{ brandColor, setBrandColor }}>
      {children}
    </BrandColorContext.Provider>
  );
};
