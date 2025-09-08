// pages/Auth/Login.jsx
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  const WP_LOGIN_URL = import.meta.env.VITE_WP_LOGIN_URL || 'https://staging2.insuppent.com/wp-login.php';

  const handleLogin = () => {
    window.location.href = WP_LOGIN_URL;
  };

  useEffect(() => {
    if (error) {
      console.error('SSO Error:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f7f5f3' }}>
      <div className="max-w-md w-full space-y-8 p-12 bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="text-center">
          {/* Logo placeholder - you'll add your logo here */}
          <div className="mb-8">
            {/* Your logo component will go here */}
            {/* // add the logo here from the public folder  */}
            <img src="/Insuppent.webp" alt="Logo" className="mx-auto h-12 w-auto" />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="text-sm text-red-600">
              {error === 'invalid_callback' && 'Invalid authentication callback. Please try again.'}
              {error === 'session_error' && 'Session error occurred. Please try again.'}
              {error.includes('OAuth') && 'Authentication error. Please contact support if this continues.'}
              {!['invalid_callback', 'session_error'].includes(error) && !error.includes('OAuth') && error}
            </div>
          </div>
        )}

        <div className="space-y-6">
          <button
            onClick={handleLogin}
            className="w-full py-4 px-6 text-white font-medium rounded-md transition-colors duration-200"
            style={{
              backgroundColor: '#8b4513',
              ':hover': { backgroundColor: '#7a3d0f' }
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#7a3d0f'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#8b4513'}
          >
            Login with Insuppent
          </button>

        </div>

      </div>
    </div>
  );
};

export default Login;