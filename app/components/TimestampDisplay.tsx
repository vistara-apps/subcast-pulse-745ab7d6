
'use client';

import { formatDistanceToNow, format } from 'date-fns';

interface TimestampDisplayProps {
  timestamp: string;
  variant?: 'relative' | 'absolute';
}

export function TimestampDisplay({ timestamp, variant = 'relative' }: TimestampDisplayProps) {
  const date = new Date(timestamp);

  if (variant === 'absolute') {
    return (
      <span className="text-xs text-gray-500">
        {format(date, 'MMM d, yyyy HH:mm')}
      </span>
    );
  }

  return (
    <span className="text-xs text-gray-500" title={format(date, 'MMM d, yyyy HH:mm')}>
      {formatDistanceToNow(date, { addSuffix: true })}
    </span>
  );
}
