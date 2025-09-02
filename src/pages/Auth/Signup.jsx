

// pages/Auth/Signup.jsx
import { useAuth } from '@/contexts/AuthContext';

const Signup = () => {
  const { signup } = useAuth();

  const handleSignup = () => {
    signup(); // This will redirect to WordPress SSO (same as login)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign up with your WordPress account
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <button
            onClick={handleSignup}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
          >
            <span className="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-emerald-500 group-hover:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
              </svg>
            </span>
            Create Account with WordPress
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={handleSignup}
                className="font-medium text-emerald-600 hover:text-emerald-500"
              >
                Sign in with WordPress
              </button>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>By creating an account, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;