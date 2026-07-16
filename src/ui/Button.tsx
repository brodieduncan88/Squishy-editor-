import type { ButtonHTMLAttributes, ReactNode } from 'react';
import Icon, { type IconName } from './Icon';

type Variant = 'primary' | 'sky' | 'mint' | 'lemon' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  block?: boolean;
  icon?: IconName;
  iconRight?: IconName;
  children?: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  block,
  icon,
  iconRight,
  children,
  className = '',
  ...rest
}: Props) {
  return (
    <button
      className={`btn btn--${variant} ${size !== 'md' ? `btn--${size}` : ''} ${
        block ? 'btn--block' : ''
      } ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'lg' ? 24 : 20} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === 'lg' ? 24 : 20} />}
    </button>
  );
}

export function IconButton({
  name,
  label,
  round,
  soft,
  size = 24,
  ...rest
}: {
  name: IconName;
  label: string;
  round?: boolean;
  soft?: boolean;
  size?: number;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = '', ...btn } = rest;
  return (
    <button
      className={`iconbtn ${round ? 'iconbtn--round' : ''} ${
        soft ? 'iconbtn--soft' : ''
      } ${className}`}
      aria-label={label}
      title={label}
      {...btn}
    >
      <Icon name={name} size={size} />
    </button>
  );
}
