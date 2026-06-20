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
              'group inline-flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
              on ? 'border-brand-600 text-brand-700' : 'border-transparent text-ink-500 hover:text-ink-900 hover:border-ink-200',
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
    <nav className="flex items-center gap-1.5 text-xs text-ink-500">
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
    <div className="px-6 pt-5 pb-4 border-b border-ink-200 bg-white">
      {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-ink-900 tracking-tight">{title}</h1>
          {description && <p className="text-sm text-ink-500 mt-1">{description}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
    </div>
  );
}

export function Toolbar({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={['flex flex-wrap items-center gap-2 px-5 py-3 border-b border-ink-200 bg-white', className].join(' ')}>
      {children}
    </div>
  );
}
