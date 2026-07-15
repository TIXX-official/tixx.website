import Link from 'next/link';
import { ElementType } from 'react';
import { cn } from '@/lib/utils';
import { Text } from './Text';

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
  target?: string;
}

const variantClasses = {
  primary: 'bg-point-500 text-grayscale-900',
  secondary: 'bg-grayscale-700 text-grayscale-0',
  outline: 'border border-grayscale-600 text-grayscale-0 bg-transparent',
};

export function Button({
  children,
  href,
  onClick,
  variant = 'primary',
  className,
  target,
}: ButtonProps) {
  const classes = cn(
    'flex w-full items-center justify-center rounded-xl px-4 py-3.5 transition-opacity hover:opacity-85 active:opacity-70',
    variantClasses[variant],
    className
  );

  const content = (
    <Text as="span" variant="body1Semibold">
      {children}
    </Text>
  );

  if (href) {
    const Component: ElementType = target ? 'a' : Link;
    return (
      <Component href={href} className={classes} target={target} rel={target ? 'noopener noreferrer' : undefined}>
        {content}
      </Component>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
