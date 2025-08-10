
'use client';

import type { User } from '../types';
import { clsx } from 'clsx';

interface UserAvatarPairProps {
  users: [User, User];
  variant?: 'horizontal' | 'stacked';
  size?: 'sm' | 'md' | 'lg';
}

export function UserAvatarPair({ users, variant = 'horizontal', size = 'md' }: UserAvatarPairProps) {
  const [user1, user2] = users;
  
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16',
  };

  if (variant === 'stacked') {
    return (
      <div className="relative">
        <img
          src={user1.profileImageUrl}
          alt={user1.displayName}
          className={clsx(sizeClasses[size], 'rounded-full border-2 border-bg')}
        />
        <img
          src={user2.profileImageUrl}
          alt={user2.displayName}
          className={clsx(
            sizeClasses[size],
            'rounded-full border-2 border-bg absolute -bottom-2 -right-2'
          )}
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <img
        src={user1.profileImageUrl}
        alt={user1.displayName}
        className={clsx(sizeClasses[size], 'rounded-full')}
      />
      <div className="text-accent text-sm">↔</div>
      <img
        src={user2.profileImageUrl}
        alt={user2.displayName}
        className={clsx(sizeClasses[size], 'rounded-full')}
      />
    </div>
  );
}
