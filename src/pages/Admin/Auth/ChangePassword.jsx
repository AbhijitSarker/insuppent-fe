import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosAdmin } from '@/api/axios/config';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      // toast.error('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
    //   toast.error('New password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosAdmin.post('/admin/auth/change-password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      if (response.data.success) {
        // toast.success('Password changed successfully');
        setTimeout(() => {
          navigate('/admin');
        }, 2000);
      }
    } catch (err) {
    //   toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Change Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Update your admin account password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="currentPassword" className="sr-only">
                Current Password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-bg-brand focus:border-bg-brand focus:z-10 sm:text-sm"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Current Password"
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="sr-only">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-bg-brand focus:border-bg-brand focus:z-10 sm:text-sm"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="New Password (min. 6 characters)"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-bg-brand focus:border-bg-brand focus:z-10 sm:text-sm"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm New Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-bg-brand hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bg-brand"
            >
              {isSubmitting ? 'Updating Password...' : 'Update Password'}
            </button>
          </div>

          <div>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bg-brand"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
