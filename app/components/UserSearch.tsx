
'use client';

import { useState } from 'react';
import { Search, User } from 'lucide-react';
import { FarcasterAPI } from '../utils/api';
import type { User as UserType } from '../types';

interface UserSearchProps {
  onUserSelect: (user: UserType) => void;
  placeholder?: string;
}

export function UserSearch({ onUserSelect, placeholder = "Search for a user..." }: UserSearchProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<UserType[]>([]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const user = await FarcasterAPI.getUserByUsername(searchQuery.replace('@', ''));
      setResults(user ? [user] : []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(value);
    }, 300);

    return () => clearTimeout(timeoutId);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 bg-surface border border-gray-700 rounded-md text-text placeholder-gray-400 focus:border-accent focus:outline-none"
        />
      </div>

      {loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-gray-700 rounded-md p-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin h-4 w-4 border-2 border-accent border-t-transparent rounded-full" />
            <span className="ml-2 text-gray-400">Searching...</span>
          </div>
        </div>
      )}

      {results.length > 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-gray-700 rounded-md shadow-lg z-10">
          {results.map((user) => (
            <div
              key={user.fid}
              onClick={() => {
                onUserSelect(user);
                setQuery('');
                setResults([]);
              }}
              className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer first:rounded-t-md last:rounded-b-md"
            >
              <img
                src={user.profileImageUrl}
                alt={user.displayName}
                className="h-10 w-10 rounded-full"
              />
              <div>
                <div className="font-semibold text-text">{user.displayName}</div>
                <div className="text-sm text-gray-400">@{user.username}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {query && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-gray-700 rounded-md p-4">
          <div className="flex items-center justify-center text-gray-400">
            <User className="h-4 w-4 mr-2" />
            No users found
          </div>
        </div>
      )}
    </div>
  );
}
