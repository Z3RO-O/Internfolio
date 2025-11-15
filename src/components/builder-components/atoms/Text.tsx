'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export interface TextProps {
  children?: React.ReactNode;
  content?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  align?: 'left' | 'center' | 'right' | 'justify';
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Text({
  children,
  content,
  variant = 'p',
  size = 'base',
  weight = 'normal',
  align = 'left',
  color,
  className,
  style,
  ...props
}: TextProps) {
  const Component = variant as keyof JSX.IntrinsicElements;

  const classes = cn(
    // Size classes
    {
      'text-xs': size === 'xs',
      'text-sm': size === 'sm',
      'text-base': size === 'base',
      'text-lg': size === 'lg',
      'text-xl': size === 'xl',
      'text-2xl': size === '2xl',
      'text-3xl': size === '3xl',
      'text-4xl': size === '4xl',
      'text-5xl': size === '5xl'
    },
    // Weight classes
    {
      'font-light': weight === 'light',
      'font-normal': weight === 'normal',
      'font-medium': weight === 'medium',
      'font-semibold': weight === 'semibold',
      'font-bold': weight === 'bold',
      'font-extrabold': weight === 'extrabold',
      'font-black': weight === 'black'
    },
    // Alignment classes
    {
      'text-left': align === 'left',
      'text-center': align === 'center',
      'text-right': align === 'right',
      'text-justify': align === 'justify'
    },
    className
  );

  const finalStyle = {
    ...style,
    ...(color && { color })
  };

  return (
    <Component className={classes} style={finalStyle} {...props}>
      {children || content}
    </Component>
  );
}


