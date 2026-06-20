import { type ReactNode } from 'react';

export function FilterSelect({ label, value, onChange, options }: { label: string; value?: string; onChange: (v: string) => void; options: { value: string; label: string }[] }) {
  return (
    <div className="flex items-center gap-1.5">
      {label && <span className="text-xs text-ink-500 whitespace-nowrap">{label}</span>}
      <select
        value={value ?? ''}
        onChange={e => onChange(e.target.value)}
        className="h-8 rounded-lg border border-ink-200 bg-white px-2.5 text-xs text-ink-700 focus-ring"
      >
        <option value="">All</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

export function Checkbox({ checked, onChange, indeterminate }: { checked: boolean; onChange?: (v: boolean) => void; indeterminate?: boolean }) {
  return (
    <button
      onClick={() => onChange?.(!checked)}
      className={[
        'h-4 w-4 rounded border flex items-center justify-center transition-colors flex-shrink-0',
        checked || indeterminate ? 'bg-brand-600 border-brand-600' : 'bg-white border-ink-300 hover:border-ink-400',
      ].join(' ')}
      aria-checked={checked}
      role="checkbox"
    >
      {indeterminate && <span className="h-0.5 w-2 bg-white rounded-sm" />}
      {checked && !indeterminate && (
        <svg className="h-3 w-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </button>
  );
}

export function Pagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center gap-1.5 px-5 py-3 border-t border-ink-200">
      <button disabled={page <= 1} onClick={() => onPage(page - 1)} className="h-7 px-2.5 rounded-md border border-ink-200 text-xs text-ink-600 hover:bg-ink-50 disabled:opacity-40 disabled:pointer-events-none">Previous</button>
      <span className="text-xs text-ink-500">Page {page} of {totalPages}</span>
      <button disabled={page >= totalPages} onClick={() => onPage(page + 1)} className="h-7 px-2.5 rounded-md border border-ink-200 text-xs text-ink-600 hover:bg-ink-50 disabled:opacity-40 disabled:pointer-events-none">Next</button>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  return <span className={['inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-medium capitalize'].join(' ')} />;
}

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  const map: Record<string, { tone: 'green' | 'blue' | 'amber' | 'red' | 'gray' | 'purple'; text: string }> = {
    active: { tone: 'green', text: 'Active' },
    on_leave: { tone: 'blue', text: 'On Leave' },
    probation: { tone: 'amber', text: 'Probation' },
    inactive: { tone: 'gray', text: 'Inactive' },
    approved: { tone: 'green', text: 'Approved' },
    paid: { tone: 'green', text: 'Paid' },
    processing: { tone: 'blue', text: 'Processing' },
    draft: { tone: 'gray', text: 'Draft' },
    submitted: { tone: 'blue', text: 'Submitted' },
    rejected: { tone: 'red', text: 'Rejected' },
    pending: { tone: 'amber', text: 'Pending' },
    overdue: { tone: 'red', text: 'Overdue' },
    filed: { tone: 'green', text: 'Filed' },
    available: { tone: 'green', text: 'Available' },
    assigned: { tone: 'blue', text: 'Assigned' },
    in_repair: { tone: 'amber', text: 'In Repair' },
    retired: { tone: 'gray', text: 'Retired' },
    open: { tone: 'blue', text: 'Open' },
    on_hold: { tone: 'amber', text: 'On Hold' },
    closed: { tone: 'gray', text: 'Closed' },
    resolved: { tone: 'green', text: 'Resolved' },
    met: { tone: 'green', text: 'SLA Met' },
    at_risk: { tone: 'amber', text: 'SLA At Risk' },
    breached: { tone: 'red', text: 'SLA Breached' },
    past_due: { tone: 'amber', text: 'Past Due' },
    churned: { tone: 'red', text: 'Churned' },
    new: { tone: 'gray', text: 'New' },
    contacted: { tone: 'blue', text: 'Contacted' },
    qualified: { tone: 'green', text: 'Qualified' },
    unqualified: { tone: 'red', text: 'Unqualified' },
    prospecting: { tone: 'blue', text: 'Prospecting' },
    qualification: { tone: 'blue', text: 'Qualification' },
    proposal: { tone: 'blue', text: 'Proposal' },
    negotiation: { tone: 'amber', text: 'Negotiation' },
    closed_won: { tone: 'green', text: 'Closed Won' },
    closed_lost: { tone: 'red', text: 'Closed Lost' },
    applied: { tone: 'gray', text: 'Applied' },
    screening: { tone: 'blue', text: 'Screening' },
    interview: { tone: 'blue', text: 'Interview' },
    offer: { tone: 'amber', text: 'Offer' },
    hired: { tone: 'green', text: 'Hired' },
    in_progress: { tone: 'blue', text: 'In Progress' },
    review: { tone: 'amber', text: 'In Review' },
    todo: { tone: 'gray', text: 'To Do' },
    done: { tone: 'green', text: 'Done' },
    published: { tone: 'green', text: 'Published' },
  };
  const r = map[status] || { tone: 'gray' as const, text: label || status };
  const toneClass = {
    green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    blue: 'bg-brand-50 text-brand-700 border-brand-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    red: 'bg-red-50 text-red-700 border-red-100',
    gray: 'bg-ink-100 text-ink-600 border-ink-200',
    purple: 'bg-violet-50 text-violet-700 border-violet-100',
  }[r.tone];
  return <span className={['inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-medium', toneClass].join(' ')}>{r.text}</span>;
}

export function ProgressBar({ value, tone = 'brand' }: { value: number; tone?: 'brand' | 'green' | 'amber' | 'red' }) {
  const colorMap = { brand: 'bg-brand-600', green: 'bg-emerald-500', amber: 'bg-amber-500', red: 'bg-red-500' };
  return (
    <div className="h-1.5 w-full bg-ink-100 rounded-full overflow-hidden">
      <div className={['h-full rounded-full transition-all duration-500', colorMap[tone]].join(' ')} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

export function Tooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span className="relative group inline-flex">
      {children}
      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-ink-900 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap z-10">
        {label}
      </span>
    </span>
  );
}
