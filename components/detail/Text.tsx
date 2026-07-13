import { ElementType, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// Mirrors apps/mobile/src/theme/fonts.js `typography` — kept as Tailwind
// arbitrary-value classes so the detail pages match the app's type scale.
const typography = {
  body1Medium: 'text-[16px] leading-[18px] tracking-[-0.02em] font-medium',
  body1Semibold: 'text-[16px] leading-[18px] tracking-[-0.02em] font-semibold',
  body1Regular: 'text-[16px] leading-[18px] tracking-[-0.02em] font-normal',
  body1RegularLarge: 'text-[16px] leading-[22px] tracking-[-0.02em] font-normal',
  body1MediumLarge: 'text-[16px] leading-[22px] tracking-[-0.02em] font-medium',
  headline1Medium: 'text-[20px] leading-[28px] tracking-[-0.02em] font-medium',
  headline1Semibold: 'text-[20px] leading-[28px] tracking-[-0.02em] font-semibold',
  h1Semibold: 'text-[24px] leading-[32px] tracking-[-0.02em] font-semibold',
  caption1Regular: 'text-[12px] leading-[14px] tracking-[-0.02em] font-normal',
  caption1Medium: 'text-[12px] leading-[14px] tracking-[-0.02em] font-medium',
  caption1RegularLarge: 'text-[12px] leading-[16px] tracking-[-0.02em] font-normal',
  body3Medium: 'text-[14px] leading-[16px] tracking-[-0.02em] font-medium',
  body3Regular: 'text-[14px] leading-[16px] tracking-[-0.02em] font-normal',
  body3RegularLarge: 'text-[14px] leading-[20px] tracking-[-0.02em] font-normal',
  body2Medium: 'text-[15px] leading-[16px] tracking-[-0.02em] font-medium',
  headline2Medium: 'text-[18px] leading-[20px] tracking-[-0.02em] font-medium',
  headline2MediumLarge: 'text-[18px] leading-[22px] font-medium',
} as const;

export type TextVariant = keyof typeof typography;

interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  variant?: TextVariant;
}

export function Text({
  as: Component = 'p',
  variant = 'body1Regular',
  className,
  ...props
}: TextProps) {
  return (
    <Component
      className={cn('font-pretendard', typography[variant], className)}
      {...props}
    />
  );
}
