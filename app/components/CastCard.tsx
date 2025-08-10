
'use client';

import { formatDistanceToNow } from 'date-fns';
import { Trash2, Eye, Lock } from 'lucide-react';
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
        'rounded-md border border-gray-700 bg-surface p-4 shadow-card transition-all duration-200',
        {
          'opacity-60 border-red-700': isDeleted,
          'hover:border-accent': !isDeleted,
        }
      )}
    >
      <div className="flex items-start gap-3">
        {author && (
          <img
            src={author.profileImageUrl}
            alt={author.displayName}
            className="h-10 w-10 rounded-full"
          />
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {author && (
              <span className="font-semibold text-text">
                {author.displayName}
              </span>
            )}
            <span className="text-sm text-gray-400">
              @{author?.username || `fid:${cast.fid}`}
            </span>
            <span className="text-xs text-gray-500">·</span>
            <span className="text-xs text-gray-500">{timeAgo}</span>
            
            {cast.isReciprocal && (
              <div className="ml-auto">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent/20 text-accent">
                  Reciprocal
                </span>
              </div>
            )}
          </div>

          <div className="text-text">
            {isDeleted ? (
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-red-400" />
                <span className="italic text-gray-400">
                  This cast was deleted
                </span>
                {onViewDeleted && (
                  <button
                    onClick={onViewDeleted}
                    className="ml-auto flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-md text-sm hover:bg-primary/30 transition-colors"
                  >
                    <Eye className="h-3 w-3" />
                    View ($0.01)
                  </button>
                )}
              </div>
            ) : (
              <p className="whitespace-pre-wrap break-words">{cast.text}</p>
            )}
          </div>

          {variant === 'detailed' && cast.mentionedFids.length > 0 && (
            <div className="mt-2 flex items-center gap-1">
              <span className="text-xs text-gray-500">Mentions:</span>
              {cast.mentionedFids.map((fid) => (
                <span key={fid} className="text-xs text-accent">
                  @{fid}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
