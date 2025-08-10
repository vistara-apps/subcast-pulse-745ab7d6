
'use client';

import { TrendingUp, Users, Zap } from 'lucide-react';
import { clsx } from 'clsx';

interface InfoBadgeProps {
  variant: 'newConnection' | 'trending' | 'reciprocal';
  count?: number;
  className?: string;
}

export function InfoBadge({ variant, count, className }: InfoBadgeProps) {
  const variants = {
    newConnection: {
      icon: Users,
      text: 'New Connection',
      className: 'bg-green-500/20 text-green-400 border-green-500/30',
    },
    trending: {
      icon: TrendingUp,
      text: 'Trending',
      className: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    },
    reciprocal: {
      icon: Zap,
      text: 'Reciprocal',
      className: 'bg-accent/20 text-accent border-accent/30',
    },
  };

  const config = variants[variant];
  const Icon = config.icon;

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border',
        config.className,
        className
      )}
    >
      <Icon className="h-3 w-3" />
      <span>{config.text}</span>
      {count && <span>({count})</span>}
    </div>
  );
}
