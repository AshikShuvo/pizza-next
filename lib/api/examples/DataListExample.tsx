'use client';

import { useState, useEffect } from 'react';
import { useApiClient, useApiLoading, useApiError } from '../hooks';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

interface CreatePostData {
  title: string;
  content: string;
  author: string;
}

export default function DataListExample() {
  const api = useApiClient();
  const { isLoading, isEndpointLoading } = useApiLoading();
  const { error, hasError, setError, clearError, getErrorMessage } = useApiError();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState<CreatePostData>({
    title: '',
    content: '',
    author: '',
  });

  // Fetch all posts
  const fetchPosts = async () => {
    try {
      clearError();
      const response = await api.get<Post[]>('/posts');
      setPosts(response.data);
    } catch (error) {
      setError(error as Error);
    }
  };

  // Create new post
  const createPost = async () => {
    try {
      clearError();
      const response = await api.post<Post>('/posts', newPost);
      setPosts(prev => [response.data, ...prev]);
      setNewPost({ title: '', content: '', author: '' });
    } catch (error) {
      setError(error as Error);
    }
  };

  // Update post
  const updatePost = async (id: string, data: Partial<Post>) => {
    try {
      clearError();
      const response = await api.put<Post>(`/posts/${id}`, data);
      setPosts(prev => prev.map(post => post.id === id ? response.data : post));
    } catch (error) {
      setError(error as Error);
    }
  };

  // Delete post
  const deletePost = async (id: string) => {
    try {
      clearError();
      await api.delete(`/posts/${id}`);
      setPosts(prev => prev.filter(post => post.id !== id));
    } catch (error) {
      setError(error as Error);
    }
  };

  // Load posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Posts Management Example</h2>
      
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

      {/* Create New Post Form */}
      <div className="mb-6 p-4 bg-gray-50 rounded">
        <h3 className="text-lg font-semibold mb-3">Create New Post</h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={newPost.title}
            onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Author"
            value={newPost.author}
            onChange={(e) => setNewPost(prev => ({ ...prev, author: e.target.value }))}
            className="w-full px-3 py-2 border rounded"
          />
          <textarea
            placeholder="Content"
            value={newPost.content}
            onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
            className="w-full px-3 py-2 border rounded h-20"
          />
          <button
            onClick={createPost}
            disabled={isLoading || !newPost.title || !newPost.content || !newPost.author}
            className={`px-4 py-2 rounded ${
              isLoading || !newPost.title || !newPost.content || !newPost.author
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            Create Post
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Posts</h3>
          <button
            onClick={fetchPosts}
            disabled={isLoading}
            className={`px-4 py-2 rounded ${
              isEndpointLoading('/posts')
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isEndpointLoading('/posts') ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No posts found</p>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{post.title}</h4>
                    <p className="text-gray-600 text-sm">By {post.author}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                    <p className="mt-2 text-gray-700">{post.content}</p>
                  </div>
                  <div className="ml-4 space-x-2">
                    <button
                      onClick={() => updatePost(post.id, { title: post.title + ' (Updated)' })}
                      disabled={isLoading}
                      className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      disabled={isLoading}
                      className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
