import { useEffect, useState } from 'react';
import axios from 'axios';

export default function SSOAuthWrapper({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/user', { withCredentials: true })
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(() => {
        window.location.href = '/api/auth/login';
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <>
      <LogoutButton />
      {children}
    </>
  );
}

function LogoutButton() {
  return (
    <button
      onClick={() => { window.location.href = '/api/auth/logout'; }}
      style={{ position: 'fixed', top: 10, right: 10 }}
    >
      Logout
    </button>
  );
}
