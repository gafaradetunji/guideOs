import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'subtle' | 'outline';
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  loading?: boolean;
}

const variants: Record<Variant, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800 shadow-sm',
  secondary: 'bg-ink-900 text-white hover:bg-ink-800 active:bg-ink-700 shadow-sm',
  outline: 'bg-white border border-ink-200 text-ink-700 hover:bg-ink-50 hover:border-ink-300',
  ghost: 'text-ink-600 hover:bg-ink-100 hover:text-ink-900',
  subtle: 'bg-ink-100 text-ink-700 hover:bg-ink-200',
  danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
};

const sizes: Record<Size, string> = {
  xs: 'h-7 px-2.5 text-xs gap-1.5 rounded-md',
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-md',
  md: 'h-9 px-3.5 text-sm gap-2 rounded-lg',
  lg: 'h-10 px-4 text-sm gap-2 rounded-lg',
  icon: 'h-9 w-9 rounded-lg',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', leftIcon, rightIcon, loading, className = '', children, disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center font-medium transition-colors focus-ring whitespace-nowrap',
        'disabled:opacity-50 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      {...rest}
    >
      {loading && <Spinner />}
      {!loading && leftIcon}
      {children}
      {!loading && rightIcon}
    </button>
  );
});

function Spinner() {
  return (
    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
    </svg>
  );
}
