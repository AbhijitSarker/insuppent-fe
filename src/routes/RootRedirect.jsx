import { Navigate } from "react-router-dom";

const RootRedirect = () => {
  // const isAuthenticated = localStorage.getItem('userToken');
  // return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/auth/login" />;
  // TODO: Remove this temporary redirect
  return <Navigate to="/admin" />;
};

export default RootRedirect;