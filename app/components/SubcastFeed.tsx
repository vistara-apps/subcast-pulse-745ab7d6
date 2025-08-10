
'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { FarcasterAPI } from '../utils/api';
import { CastCard } from './CastCard';
import { UserAvatarPair } from './UserAvatarPair';
import { useNotification } from '@coinbase/onchainkit/minikit';
import type { User, Subcast } from '../types';

interface SubcastFeedProps {
  users: [User, User];
  onBack: () => void;
}

export function SubcastFeed({ users, onBack }: SubcastFeedProps) {
  const [subcasts, setSubcasts] = useState<Subcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const sendNotification = useNotification();

  useEffect(() => {
    async function loadSubcasts() {
      setLoading(true);
      try {
        const feedData = await FarcasterAPI.getSubcastsBetweenUsers(users[0].fid, users[1].fid);
        setSubcasts(feedData);
      } catch (error) {
        console.error('Error loading subcasts:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSubcasts();
  }, [users]);

  const handleViewDeleted = async (cast: Subcast) => {
    try {
      // Simulate micro-transaction for deleted cast viewing
      await sendNotification({
        title: 'Deleted Cast Unlocked! 🔓',
        body: 'You can now view the deleted conversation content.',
      });

      // Update the cast to show content (mock implementation)
      setSubcasts(prev => 
        prev.map(c => 
          c.castHash === cast.castHash 
            ? { ...c, text: 'This was the original deleted content...', deleted: false }
            : c
        )
      );
    } catch (error) {
      console.error('Failed to unlock deleted cast:', error);
    }
  };

  const sortedSubcasts = [...subcasts].sort((a, b) => {
    const dateA = new Date(a.timestamp).getTime();
    const dateB = new Date(b.timestamp).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 bg-surface rounded-md hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="animate-pulse h-8 bg-surface rounded w-48" />
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-surface rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 bg-surface rounded-md hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          
          <div className="flex items-center gap-4">
            <UserAvatarPair users={users} size="sm" />
            <div>
              <h2 className="text-lg font-bold text-text">
                {users[0].displayName} ↔ {users[1].displayName}
              </h2>
              <p className="text-sm text-gray-400">
                {subcasts.length} subcasts in conversation
              </p>
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
            className="flex items-center gap-2 px-3 py-2 bg-surface rounded-md hover:bg-gray-700 transition-colors text-sm"
          >
            {sortOrder === 'newest' ? <Calendar className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
            {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
          </button>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {sortedSubcasts.map((cast) => {
          const author = users.find(u => u.fid === cast.fid);
          return (
            <CastCard
              key={cast.castHash}
              cast={cast}
              author={author}
              onViewDeleted={() => handleViewDeleted(cast)}
            />
          );
        })}

        {subcasts.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            <div className="mb-4">
              <UserAvatarPair users={users} size="lg" />
            </div>
            <p>No subcasts found between these users yet.</p>
            <p className="text-sm mt-2">Start a conversation to see it here!</p>
          </div>
        )}
      </div>
    </div>
  );
}
