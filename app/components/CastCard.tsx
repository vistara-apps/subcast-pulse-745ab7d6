'use client';

import { formatDistanceToNow } from 'date-fns';
import { Trash2, Eye, Lock, Users } from 'lucide-react';
import type { Subcast, User } from '../types';
import { clsx } from 'clsx';

interface CastCardProps {
  cast: Subcast;
  variant?: 'compact' | 'detailed' | 'deletedTag';
  author?: User;
  onViewDeleted?: () => void;
}

export function CastCard({ cast, variant = 'detailed', author, onViewDeleted }: CastCardProps) {
  const isDeleted = cast.deleted;
  const timeAgo = formatDistanceToNow(new Date(cast.timestamp), { addSuffix: true });

  return (
    <div
      className={clsx(
        'card p-6 animate-slide-up group',
        {
          'opacity-70 border-error/50 bg-error/5': isDeleted,
          'card-hover': !isDeleted,
        }
      )}
    >
      <div className="flex items-start gap-4">
        {author && (
          <div className="relative flex-shrink-0">
            <img
              src={author.profileImageUrl}
              alt={author.displayName}
              className="h-12 w-12 rounded-full ring-2 ring-border group-hover:ring-primary/50 transition-all duration-200"
            />
            <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-success rounded-full border-2 border-surface" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            {author && (
              <span className="font-semibold text-text-primary">
                {author.displayName}
              </span>
            )}
            <span className="text-sm text-text-muted font-medium">
              @{author?.username || `fid:${cast.fid}`}
            </span>
            <span className="text-border">•</span>
            <span className="text-sm text-text-muted">{timeAgo}</span>
            
            {cast.isReciprocal && (
              <div className="ml-auto">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/10 text-accent border border-accent/20">
                  ↔ Reciprocal
                </span>
              </div>
            )}
          </div>

          <div className="text-text-secondary leading-relaxed">
            {isDeleted ? (
              <div className="flex items-center justify-between p-4 bg-error/5 border border-error/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-error/20 rounded-full flex items-center justify-center">
                    <Trash2 className="h-4 w-4 text-error" />
                  </div>
                  <div>
                    <span className="text-text-primary font-medium">
                      This cast was deleted
                    </span>
                    <p className="text-sm text-text-muted mt-1">
                      Original content is no longer available
                    </p>
                  </div>
                </div>
                {onViewDeleted && (
                  <button
                    onClick={onViewDeleted}
                    className="btn-primary text-sm flex items-center gap-2"
                    aria-label="View deleted content for $0.01"
                  >
                    <Eye className="h-4 w-4" />
                    View ($0.01)
                  </button>
                )}
              </div>
            ) : (
              <div className="prose prose-invert max-w-none">
                <p className="whitespace-pre-wrap break-words text-text-primary leading-relaxed">
                  {cast.text}
                </p>
              </div>
            )}
          </div>

          {variant === 'detailed' && cast.mentionedFids.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-text-muted" />
                <span className="text-sm font-medium text-text-muted">Mentions</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {cast.mentionedFids.map((fid) => (
                  <span 
                    key={fid} 
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-accent/10 text-accent border border-accent/20"
                  >
                    @{fid}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
