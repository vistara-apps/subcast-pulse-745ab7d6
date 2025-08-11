
'use client';

import { formatDistanceToNow } from 'date-fns';
import { Trash2, Eye, Lock, User as UserIcon, Heart, MessageCircle, Repeat } from 'lucide-react';
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
        'rounded-lg border bg-surface p-6 shadow-lg transition-all duration-200 hover:shadow-xl',
        {
          'opacity-60 border-red-700 bg-red-900/10': isDeleted,
          'border-gray-600 hover:border-accent/50 hover:bg-surface/80': !isDeleted,
        }
      )}
    >
      <div className="flex items-start gap-3">
        {author && (
          <div className="relative">
            <div className="h-10 w-10 rounded-full border-2 border-gray-600 bg-surface flex items-center justify-center overflow-hidden group">
              {author.profileImageUrl ? (
                <>
                  <img
                    src={author.profileImageUrl}
                    alt={author.displayName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        const fallback = parent.querySelector('.fallback-icon');
                        if (fallback) {
                          (fallback as HTMLElement).style.display = 'flex';
                        }
                      }
                    }}
                  />
                  <div className="fallback-icon hidden w-full h-full items-center justify-center bg-gradient-to-br from-primary to-accent">
                    <UserIcon className="h-5 w-5 text-white" />
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-accent">
                  <UserIcon className="h-5 w-5 text-white" />
                </div>
              )}
              <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
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

          <div className="text-text mb-3">
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
              <p className="whitespace-pre-wrap break-words leading-relaxed">{cast.text}</p>
            )}
          </div>

          {!isDeleted && (
            <div className="flex items-center gap-6 pt-2 border-t border-gray-700">
              <button className="flex items-center gap-2 text-gray-400 hover:text-accent transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-accent/10 transition-colors">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <span className="text-sm">Reply</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-green-400/10 transition-colors">
                  <Repeat className="h-4 w-4" />
                </div>
                <span className="text-sm">Recast</span>
              </button>
              <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-red-400/10 transition-colors">
                  <Heart className="h-4 w-4" />
                </div>
                <span className="text-sm">Like</span>
              </button>
            </div>
          )}

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
