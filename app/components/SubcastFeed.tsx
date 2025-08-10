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
      <div className="space-y-6 animate-in">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="btn-secondary p-3"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              <div className="skeleton h-12 w-12 rounded-full" />
              <div className="skeleton h-12 w-12 rounded-full" />
            </div>
            <div className="space-y-2">
              <div className="skeleton h-6 w-48 rounded" />
              <div className="skeleton h-4 w-32 rounded" />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex items-start gap-4">
                <div className="skeleton h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="skeleton h-4 w-24 rounded" />
                    <div className="skeleton h-4 w-16 rounded" />
                    <div className="skeleton h-4 w-20 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="skeleton h-4 w-full rounded" />
                    <div className="skeleton h-4 w-3/4 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button
              onClick={onBack}
              className="btn-secondary p-3 group"
              aria-label="Go back to previous view"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-0.5 transition-transform duration-200" />
            </button>
            
            <div className="flex items-center gap-5">
              <div className="relative">
                <UserAvatarPair users={users} size="sm" />
                <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-accent rounded-full border-2 border-surface animate-pulse-slow" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-text-primary mb-1">
                  {users[0].displayName} 
                  <span className="mx-3 text-accent">↔</span>
                  {users[1].displayName}
                </h2>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-text-muted font-medium">
                    {subcasts.length} subcasts in conversation
                  </span>
                  <span className="text-border">•</span>
                  <span className="text-text-muted">
                    Active conversation
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
              className="btn-secondary flex items-center gap-2 text-sm"
              aria-label={`Sort by ${sortOrder === 'newest' ? 'oldest' : 'newest'} first`}
            >
              {sortOrder === 'newest' ? <Calendar className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
              {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
            </button>
          </div>
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
          <div className="card p-12 text-center animate-scale-in">
            <div className="space-y-6">
              <div className="relative">
                <UserAvatarPair users={users} size="lg" />
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <div className="h-8 w-8 bg-surface-hover rounded-full flex items-center justify-center border-2 border-surface">
                    <span className="text-text-muted text-xs">💬</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">
                  No conversation yet
                </h3>
                <p className="text-text-muted mb-4 max-w-md mx-auto leading-relaxed">
                  These users haven't started a subcast conversation yet. When they do, 
                  their messages will appear here.
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full border border-primary/20">
                    🚀 Be the first to start!
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
