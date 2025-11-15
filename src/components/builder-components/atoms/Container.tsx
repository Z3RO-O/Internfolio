'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps {
  children?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  layout?: 'flex' | 'grid' | 'block';
  direction?: 'row' | 'column';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  align?: 'start' | 'center' | 'end' | 'stretch';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  gridCols?: '1' | '2' | '3' | '4' | '5' | '6';
  className?: string;
  style?: React.CSSProperties;
}

export default function Container({
  children,
  maxWidth = 'xl',
  padding = 'md',
  layout = 'block',
  direction = 'row',
  justify = 'start',
  align = 'start',
  gap = 'md',
  gridCols = '3',
  className,
  style,
  ...props
}: ContainerProps) {
  const classes = cn(
    'w-full mx-auto',
    // Max width
    {
      'max-w-sm': maxWidth === 'sm',
      'max-w-md': maxWidth === 'md',
      'max-w-lg': maxWidth === 'lg',
      'max-w-xl': maxWidth === 'xl',
      'max-w-2xl': maxWidth === '2xl',
      'max-w-full': maxWidth === 'full'
    },
    // Padding
    {
      'p-0': padding === 'none',
      'p-2': padding === 'sm',
      'p-4': padding === 'md',
      'p-6': padding === 'lg',
      'p-8': padding === 'xl'
    },
    // Layout
    {
      flex: layout === 'flex',
      grid: layout === 'grid',
      block: layout === 'block'
    },
    // Flex direction (only if layout is flex)
    layout === 'flex' && {
      'flex-row': direction === 'row',
      'flex-col': direction === 'column'
    },
    // Justify content (flex only)
    layout === 'flex' && {
      'justify-start': justify === 'start',
      'justify-center': justify === 'center',
      'justify-end': justify === 'end',
      'justify-between': justify === 'between',
      'justify-around': justify === 'around'
    },
    // Align items (flex only)
    layout === 'flex' && {
      'items-start': align === 'start',
      'items-center': align === 'center',
      'items-end': align === 'end',
      'items-stretch': align === 'stretch'
    },
    // Gap (flex/grid only)
    (layout === 'flex' || layout === 'grid') && {
      'gap-0': gap === 'none',
      'gap-2': gap === 'sm',
      'gap-4': gap === 'md',
      'gap-6': gap === 'lg',
      'gap-8': gap === 'xl'
    },
    // Grid columns (grid only)
    layout === 'grid' && {
      'grid-cols-1': gridCols === '1',
      'grid-cols-2': gridCols === '2',
      'grid-cols-3': gridCols === '3',
      'grid-cols-4': gridCols === '4',
      'grid-cols-5': gridCols === '5',
      'grid-cols-6': gridCols === '6'
    },
    className
  );

  return (
    <div className={classes} style={style} {...props}>
      {children}
    </div>
  );
}


