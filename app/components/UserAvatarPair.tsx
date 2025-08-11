
'use client';

import type { User } from '../types';
import { clsx } from 'clsx';
import { User as UserIcon } from 'lucide-react';

interface UserAvatarPairProps {
  users: [User, User];
  variant?: 'horizontal' | 'stacked';
  size?: 'sm' | 'md' | 'lg';
}

function UserAvatar({ user, size }: { user: User; size: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16',
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={clsx(
      sizeClasses[size], 
      'rounded-full border-2 border-gray-600 bg-surface flex items-center justify-center overflow-hidden relative group'
    )}>
      {user.profileImageUrl ? (
        <>
          <img
            src={user.profileImageUrl}
            alt={user.displayName}
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
            <UserIcon className={clsx(iconSizes[size], 'text-white')} />
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-accent">
          <UserIcon className={clsx(iconSizes[size], 'text-white')} />
        </div>
      )}
      <div className="absolute inset-0 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}

export function UserAvatarPair({ users, variant = 'horizontal', size = 'md' }: UserAvatarPairProps) {
  const [user1, user2] = users;

  if (variant === 'stacked') {
    return (
      <div className="relative">
        <UserAvatar user={user1} size={size} />
        <div className="absolute -bottom-2 -right-2">
          <UserAvatar user={user2} size={size} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <UserAvatar user={user1} size={size} />
      <div className="flex items-center justify-center p-2 rounded-full bg-accent/20">
        <div className="text-accent text-lg font-bold">↔</div>
      </div>
      <UserAvatar user={user2} size={size} />
    </div>
  );
}
