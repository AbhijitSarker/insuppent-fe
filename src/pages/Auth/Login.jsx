// pages/Auth/Login.jsx
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearchParams } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');

  const handleLogin = () => {
    login(); // This will redirect to WordPress SSO
  };

  useEffect(() => {
    if (error) {
      console.error('SSO Error:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in with your WordPress account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-sm text-red-600">
              {error === 'invalid_callback' && 'Invalid authentication callback. Please try again.'}
              {error === 'session_error' && 'Session error occurred. Please try again.'}
              {error.includes('OAuth') && 'Authentication error. Please contact support if this continues.'}
              {!['invalid_callback', 'session_error'].includes(error) && !error.includes('OAuth') && error}
            </div>
          </div>
        )}

        <div className="mt-8 space-y-6">
          <button
            onClick={handleLogin}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </span>
            Sign in with WordPress
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={handleLogin}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Create one with WordPress
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>By signing in, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default Login;