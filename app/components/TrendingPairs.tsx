'use client';

import { useState, useEffect } from 'react';
import { TrendingUp } from 'lucide-react';
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
      <div className="space-y-6 animate-in">
        <div className="flex items-center gap-3">
          <div className="skeleton h-8 w-8 rounded-lg" />
          <div className="skeleton h-6 w-48 rounded" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  <div className="skeleton h-12 w-12 rounded-full" />
                  <div className="skeleton h-12 w-12 rounded-full" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-5 w-40 rounded" />
                  <div className="skeleton h-4 w-32 rounded" />
                </div>
                <div className="skeleton h-6 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
          <TrendingUp className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary">Trending Subcast Pairs</h2>
      </div>
      
      <div className="space-y-4">
        {pairs.map((pair, index) => (
          <div
            key={index}
            onClick={() => onSelectPair(pair)}
            className="card card-interactive p-6 group animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
            role="button"
            tabIndex={0}
            aria-label={`View conversation between ${pair.users[0].displayName} and ${pair.users[1].displayName}`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectPair(pair);
              }
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5 flex-1 min-w-0">
                <div className="relative">
                  <UserAvatarPair users={pair.users} size="md" />
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-success rounded-full border-2 border-surface group-hover:scale-110 transition-transform duration-200" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-text-primary truncate">
                      {pair.users[0].displayName}
                    </span>
                    <div className="flex items-center gap-1 text-accent">
                      <div className="h-1 w-1 bg-accent rounded-full animate-pulse" />
                      <div className="h-1 w-1 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                      <div className="h-1 w-1 bg-accent rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
                    </div>
                    <span className="font-semibold text-text-primary truncate">
                      {pair.users[1].displayName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-text-muted font-medium">
                      {pair.subcastCount} subcasts
                    </span>
                    <span className="text-border">•</span>
                    <TimestampDisplay timestamp={pair.lastActivity} />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 ml-4">
                <InfoBadge variant="trending" />
                {pair.isReciprocal && <InfoBadge variant="reciprocal" />}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {pairs.length === 0 && (
        <div className="card p-12 text-center animate-scale-in">
          <div className="space-y-4">
            <div className="h-16 w-16 bg-surface-hover rounded-full flex items-center justify-center mx-auto">
              <TrendingUp className="h-8 w-8 text-text-muted" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">No trending pairs yet</h3>
              <p className="text-text-muted">
                Check back later to see the most active conversations!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
