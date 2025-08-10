
'use client';

import { useState, useEffect } from 'react';
import { FarcasterAPI } from '../utils/api';
import { UserAvatarPair } from './UserAvatarPair';
import { InfoBadge } from './InfoBadge';
import { TimestampDisplay } from './TimestampDisplay';
import type { TrendingPair } from '../types';

interface TrendingPairsProps {
  onSelectPair: (pair: TrendingPair) => void;
}

export function TrendingPairs({ onSelectPair }: TrendingPairsProps) {
  const [pairs, setPairs] = useState<TrendingPair[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrendingPairs() {
      try {
        const trendingPairs = await FarcasterAPI.getTrendingSubcastPairs();
        setPairs(trendingPairs);
      } catch (error) {
        console.error('Error loading trending pairs:', error);
      } finally {
        setLoading(false);
      }
    }

    loadTrendingPairs();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-surface rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-text mb-4">Trending Subcast Pairs</h2>
      
      {pairs.map((pair, index) => (
        <div
          key={index}
          onClick={() => onSelectPair(pair)}
          className="bg-surface rounded-lg p-4 border border-gray-700 hover:border-accent cursor-pointer transition-all duration-200 hover:shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <UserAvatarPair users={pair.users} size="md" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-text">
                    {pair.users[0].displayName}
                  </span>
                  <span className="text-gray-400">↔</span>
                  <span className="font-semibold text-text">
                    {pair.users[1].displayName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">
                    {pair.subcastCount} subcasts
                  </span>
                  <span className="text-gray-500">·</span>
                  <TimestampDisplay timestamp={pair.lastActivity} />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <InfoBadge variant="trending" />
              {pair.isReciprocal && <InfoBadge variant="reciprocal" />}
            </div>
          </div>
        </div>
      ))}
      
      {pairs.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No trending pairs found. Check back later!
        </div>
      )}
    </div>
  );
}
