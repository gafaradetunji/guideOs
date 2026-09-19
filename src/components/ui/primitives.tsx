import { type ReactNode, type HTMLAttributes, type TdHTMLAttributes, type ThHTMLAttributes } from 'react';

export function Card({ className = '', children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={['panel-sheen bg-white/90 border border-white/70 rounded-xl shadow-card', className].join(' ')} {...rest}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }: { title: ReactNode; subtitle?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-4 sm:px-5 py-3.5 border-b border-ink-200/80">
      <div className="min-w-0">
        <h3 className="text-[13px] font-semibold tracking-[0.01em] text-ink-900">{title}</h3>
        {subtitle && <p className="text-[11px] text-ink-500 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={['p-4 sm:p-5', className].join(' ')}>{children}</div>;
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
    <span className={['inline-flex items-center gap-1.5 px-2 py-1 text-[10px] font-medium font-mono uppercase tracking-[0.08em] rounded-md border', toneMap[tone], className].join(' ')}>
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />}
      {children}
    </span>
  );
}

export function Table({ children, containerClassName = '' }: { children: ReactNode; containerClassName?: string }) {
  return (
    <div className={['w-full max-w-full overflow-x-auto scrollbar-thin', containerClassName].join(' ')}>
      <table className="w-full min-w-[640px] text-sm">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: ReactNode }) {
  return <thead className="bg-ink-900/[0.03] border-b border-ink-200">{children}</thead>;
}

export function Th({ children, className = '', ...rest }: ThHTMLAttributes<HTMLTableCellElement> & { children?: ReactNode }) {
  return (
    <th className={['text-left text-[10px] font-mono font-medium uppercase tracking-[0.12em] text-ink-500 px-4 py-2.5 whitespace-nowrap', className].join(' ')} {...rest}>
      {children}
    </th>
  );
}

export function TBody({ children }: { children: ReactNode }) {
  return <tbody className="divide-y divide-ink-100">{children}</tbody>;
}

export function Td({ children, className = '', ...rest }: TdHTMLAttributes<HTMLTableCellElement> & { children?: ReactNode }) {
  // Cells stay on one line so the horizontal scroll (rather than tall wrapped rows)
  // is what absorbs narrow viewports. Opt out per-cell with `whitespace-normal`.
  return (
    <td className={['px-4 py-3 text-ink-700 align-middle whitespace-nowrap', className].join(' ')} {...rest}>
      {children}
    </td>
  );
}

export function Tr({ children, className = '', onClick, ...rest }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <tr
      className={['bg-white/80 transition-colors', onClick ? 'cursor-pointer hover:bg-brand-50/40' : '', className].join(' ')}
      onClick={onClick}
      {...rest as any}
    >
      {children}
    </tr>
  );
}

export function Avatar({ name, size = 32, src }: { name: string; size?: number; src?: string }) {
  const initials = name.split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase();
  const palette = ['#2563eb', '#0f172a', '#0f766e', '#4338ca', '#374151', '#0369a1'];
  const idx = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length;
  return (
    <span
      className="inline-flex items-center justify-center rounded-md text-white font-medium overflow-hidden flex-shrink-0 ring-1 ring-black/5"
      style={{ width: size, height: size, background: src ? undefined : palette[idx], fontSize: size * 0.4 }}
    >
      {src ? <img src={src} alt={name} className="h-full w-full object-cover" /> : initials}
    </span>
  );
}

export function Input({ className = '', ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={['h-9 w-full rounded-md border border-ink-300 bg-white/90 px-3 text-sm text-ink-800 placeholder:text-ink-400 shadow-sm focus:border-brand-400 focus:bg-white focus-ring', className].join(' ')}
      {...rest}
    />
  );
}

export function Select({ className = '', children, ...rest }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={['h-9 w-full rounded-md border border-ink-300 bg-white/90 px-3 text-sm text-ink-800 shadow-sm focus:border-brand-400 focus:bg-white focus-ring', className].join(' ')}
      {...rest}
    >
      {children}
    </select>
  );
}

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4 sm:px-6 py-10 sm:py-14">
      {icon && <div className="h-12 w-12 rounded-lg bg-ink-100 flex items-center justify-center text-ink-400 mb-3">{icon}</div>}
      <p className="text-sm font-medium text-ink-900">{title}</p>
      {description && <p className="text-xs text-ink-500 mt-1 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Stat({ label, value, delta, tone = 'green' }: { label: string; value: string; delta?: string; tone?: 'green' | 'red' | 'gray' }) {
  const toneText = { green: 'text-emerald-700', red: 'text-red-700', gray: 'text-ink-500' }[tone];
  return (
    <Card className="overflow-hidden">
      <div className="p-4 sm:p-5">
        <p className="tech-label text-ink-500 truncate">{label}</p>
        <p className="text-xl sm:text-2xl lg:text-[28px] leading-none font-semibold text-ink-900 mt-2 sm:mt-3 break-words">{value}</p>
        {delta && <p className={['text-[11px] font-medium mt-2', toneText].join(' ')}>{delta}</p>}
      </div>
    </Card>
  );
}
