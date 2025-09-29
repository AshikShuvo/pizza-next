'use client';

import { useState } from 'react';
import { useApiClient, useApiLoading, useApiError } from '../hooks';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UpdateProfileData {
  name?: string;
  email?: string;
  avatar?: string;
}

export default function UserProfileExample() {
  const { apiClient: api, isReady: isApiReady } = useApiClient();
  const { isLoading, isEndpointLoading } = useApiLoading();
  const { error, hasError, setError, clearError, getErrorMessage } = useApiError();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [updateData, setUpdateData] = useState<UpdateProfileData>({});

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      clearError();
      const response = await api.get<UserProfile>('/users/profile');
      setProfile(response.data);
    } catch (error) {
      setError(error as Error);
    }
  };

  // Update user profile
  const updateUserProfile = async () => {
    try {
      clearError();
      const response = await api.put<UserProfile>('/users/profile', updateData);
      setProfile(response.data);
      setUpdateData({});
    } catch (error) {
      setError(error as Error);
    }
  };

  // Delete user profile
  const deleteUserProfile = async () => {
    try {
      clearError();
      await api.delete('/users/profile');
      setProfile(null);
    } catch (error) {
      setError(error as Error);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">User Profile Example</h2>
      
      {/* Global Loading State */}
      {isLoading && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-800 rounded">
          Loading... ({isLoading ? 'Active requests in progress' : ''})
        </div>
      )}

      {/* Error Display */}
      {hasError && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded">
          <p className="font-semibold">Error:</p>
          <p>{getErrorMessage()}</p>
          <button 
            onClick={clearError}
            className="mt-2 px-3 py-1 bg-red-200 hover:bg-red-300 rounded text-sm"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Profile Display */}
      {profile && (
        <div className="mb-4 p-4 bg-gray-50 rounded">
          <h3 className="font-semibold">Current Profile:</h3>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          {profile.avatar && (
            <p><strong>Avatar:</strong> {profile.avatar}</p>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={fetchUserProfile}
          disabled={isLoading}
          className={`w-full px-4 py-2 rounded ${
            isEndpointLoading('/users/profile')
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isEndpointLoading('/users/profile') ? 'Loading Profile...' : 'Fetch Profile'}
        </button>

        <div className="space-y-2">
          <input
            type="text"
            placeholder="Name"
            value={updateData.name || ''}
            onChange={(e) => setUpdateData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={updateData.email || ''}
            onChange={(e) => setUpdateData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
          />
          <button
            onClick={updateUserProfile}
            disabled={isLoading || (!updateData.name && !updateData.email)}
            className={`w-full px-4 py-2 rounded ${
              isLoading || (!updateData.name && !updateData.email)
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            Update Profile
          </button>
        </div>

        <button
          onClick={deleteUserProfile}
          disabled={isLoading || !profile}
          className={`w-full px-4 py-2 rounded ${
            isLoading || !profile
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-red-500 hover:bg-red-600 text-white'
          }`}
        >
          Delete Profile
        </button>
      </div>
    </div>
  );
}
