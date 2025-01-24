import React from 'react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  className?: string;
}

export function StatsCard({ title, value, change, icon, className }: StatsCardProps) {
  const isPositive = change >= 0;

  return (
    <div className={cn('stats-card', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="stats-label">{title}</p>
          <h3 className="stats-value">{value}</h3>
          <p className={cn('stats-change', isPositive ? 'positive' : 'negative')}>
            {isPositive ? '+' : ''}{change}% from last month
          </p>
        </div>
        <div className="icon-container">
          {icon}
        </div>
      </div>
    </div>
  );
} 