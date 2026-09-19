import { type ReactNode } from 'react';

interface TabItem {
  key: string;
  label: string;
  icon?: ReactNode;
  badge?: ReactNode;
}

export function Tabs({ items, active, onChange, className = '' }: { items: TabItem[]; active: string; onChange: (k: string) => void; className?: string }) {
  return (
    <div className={['flex items-center gap-1 border-b border-ink-200 overflow-x-auto scrollbar-thin', className].join(' ')}>
      {items.map(it => {
        const on = it.key === active;
        return (
          <button
            key={it.key}
            onClick={() => onChange(it.key)}
            className={[
              'group inline-flex items-center gap-2 px-3 py-2.5 text-[12px] font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
              on ? 'border-ink-900 text-ink-900' : 'border-transparent text-ink-500 hover:text-ink-900 hover:border-ink-300',
            ].join(' ')}
          >
            {it.icon}
            {it.label}
            {it.badge}
          </button>
        );
      })}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; onClick?: () => void; icon?: ReactNode }[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.08em] text-ink-500 whitespace-nowrap">
      {items.map((it, i) => {
        const last = i === items.length - 1;
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-ink-300">/</span>}
            {last ? (
              <span className="font-medium text-ink-900 flex items-center gap-1.5">{it.icon}{it.label}</span>
            ) : (
              <button onClick={it.onClick} className="flex items-center gap-1.5 hover:text-ink-900 transition-colors">
                {it.icon}{it.label}
              </button>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export function PageHeader({ title, description, actions, breadcrumbs }: { title: ReactNode; description?: ReactNode; actions?: ReactNode; breadcrumbs?: ReactNode }) {
  return (
    <div className="panel-sheen px-4 sm:px-6 pt-4 sm:pt-5 pb-4 border-b border-ink-200/80 bg-white/80">
      {breadcrumbs && <div className="mb-2 overflow-x-auto scrollbar-thin">{breadcrumbs}</div>}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-4">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl lg:text-[22px] font-semibold text-ink-900 tracking-[-0.02em]">{title}</h1>
          {description && <p className="text-xs sm:text-sm text-ink-500 mt-1.5 max-w-3xl">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2 md:flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

export function Toolbar({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={['flex flex-wrap items-center gap-2 px-4 sm:px-5 py-3 border-b border-ink-200 bg-white/80 backdrop-blur-sm', className].join(' ')}>
      {children}
    </div>
  );
}
