import { type ReactNode, type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from 'react';

export function Card({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={['bg-white border border-ink-200 rounded-xl shadow-card', className].join(' ')} {...rest}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }: { title: ReactNode; subtitle?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-ink-200">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
        {subtitle && <p className="text-xs text-ink-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={['p-5', className].join(' ')}>{children}</div>;
}

type Tone = 'gray' | 'green' | 'red' | 'amber' | 'blue' | 'purple' | 'ink';

const toneMap: Record<Tone, string> = {
  gray: 'bg-ink-100 text-ink-600',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  red: 'bg-red-50 text-red-700 border-red-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
  blue: 'bg-brand-50 text-brand-700 border-brand-100',
  purple: 'bg-violet-50 text-violet-700 border-violet-100',
  ink: 'bg-ink-900 text-white',
};

export function Badge({ tone = 'gray', children, className = '', dot = false }: { tone?: Tone; children: ReactNode; className?: string; dot?: boolean }) {
  return (
    <span className={['inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium rounded-md border', toneMap[tone], className].join(' ')}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />}
      {children}
    </span>
  );
}

export function Table({ children, containerClassName = '' }: { children: ReactNode; containerClassName?: string }) {
  return (
    <div className={['overflow-x-auto scrollbar-thin', containerClassName].join(' ')}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return <thead className="bg-ink-50 border-b border-ink-200">{children}</thead>;
}

export function Th({ children, className = '', ...rest }: ThHTMLAttributes<HTMLTableCellElement> & { children?: ReactNode }) {
  return (
    <th className={['text-left text-[11px] font-semibold uppercase tracking-wide text-ink-500 px-4 py-2.5 whitespace-nowrap', className].join(' ')} {...rest}>
      {children}
    </th>
  );
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-ink-100">{children}</tbody>;
}

export function Td({ children, className = '', ...rest }: TdHTMLAttributes<HTMLTableCellElement> & { children?: ReactNode }) {
  return (
    <td className={['px-4 py-3 text-ink-700 align-middle', className].join(' ')} {...rest}>
      {children}
    </td>
  );
}

export function Tr({ children, className = '', onClick, ...rest }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <tr
      className={['bg-white transition-colors', onClick ? 'cursor-pointer hover:bg-ink-50' : '', className].join(' ')}
      onClick={onClick}
      {...rest as any}
    >
      {children}
    </tr>
  );
}

export function Avatar({ name, size = 32, src }: { name: string; size?: number; src?: string }) {
  const initials = name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  const palette = ['#3463ff', '#e84a18', '#0f1013', '#1731e1', '#43474f', '#9d2a11'];
  const idx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length;
  return (
    <span
      className="inline-flex items-center justify-center rounded-full text-white font-medium overflow-hidden flex-shrink-0"
      style={{ width: size, height: size, background: src ? undefined : palette[idx], fontSize: size * 0.4 }}
    >
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials}
    </span>
  );
}

export function Input({ className = '', ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={['h-9 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm placeholder:text-ink-400 focus-ring', className].join(' ')}
      {...rest}
    />
  );
}

export function Select({ className = '', children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={['h-9 w-full rounded-lg border border-ink-200 bg-white px-3 text-sm focus-ring', className].join(' ')}
      {...rest}
    >
      {children}
    </select>
  );
}

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-14">
      {icon && <div className="h-12 w-12 rounded-xl bg-ink-100 flex items-center justify-center text-ink-400 mb-3">{icon}</div>}
      <p className="text-sm font-medium text-ink-900">{title}</p>
      {description && <p className="text-xs text-ink-500 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Stat({ label, value, delta, tone = 'green' }: { label: string; value: string; delta?: string; tone?: 'green' | 'red' | 'gray' }) {
  const toneText = { green: 'text-emerald-600', red: 'text-red-600', gray: 'text-ink-500' }[tone];
  return (
    <Card>
      <div className="p-5">
        <p className="text-xs font-medium text-ink-500 uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-semibold text-ink-900 mt-2">{value}</p>
        {delta && <p className={['text-xs font-medium mt-1', toneText].join(' ')}>{delta}</p>}
      </div>
    </Card>
  );
}
