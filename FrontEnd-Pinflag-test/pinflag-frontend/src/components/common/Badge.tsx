import React from 'react';

export type BadgeVariant =
  | 'emerald'
  | 'indigo'
  | 'amber'
  | 'slate'
  | 'rose'
  | 'blue'
  | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  slate: 'bg-slate-700/40 text-slate-300 border-slate-600/30',
  rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

const sizeStyles = {
  sm: 'text-xs px-2 py-0.5 font-medium gap-1',
  md: 'text-xs px-2.5 py-1 font-semibold gap-1.5',
  lg: 'text-sm px-3 py-1.5 font-semibold gap-2',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  size = 'md',
  icon,
  className = '',
}) => {
  return (
    <span
      className={`inline-flex items-center rounded-full border transition-all duration-200 ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
