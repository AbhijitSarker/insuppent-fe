import React from 'react';
import { Outlet } from 'react-router-dom';

const UserLayout = () => {
  return (
    <>
    Hello
    <Outlet />
    </>
  );
};

export default UserLayout;