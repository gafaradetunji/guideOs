import {
  Briefcase, Ticket, ChevronRight, Zap, ShieldCheck, AlertTriangle, Network, Database, CheckCircle2,
} from 'lucide-react';
import { Card, CardHeader, CardBody, Stat, Avatar, PageHeader, Badge, Button } from '../../components/ui';
import { StatusBadge, ProgressBar } from '../../components/ui/Filters';
import { activities, tickets, opportunities, formatCurrency, relativeTime } from '../../data/seed';
import { useMockData } from '../../mock/MockDataProvider';
import type { RouteProps } from '../../lib/types';

export function DashboardPage({ navigate }: RouteProps) {
  const { employees, leaveRequests, payrollRuns, invoices } = useMockData();
  const totalHeadcount = employees.filter(e => e.status !== 'inactive').length;
  const activeTickets = tickets.filter(t => t.status === 'open' || t.status === 'pending').length;
  const urgentTickets = tickets.filter(t => t.priority === 'urgent').length;
  const openPipeline = opportunities
    .filter(o => o.stage !== 'closed_won' && o.stage !== 'closed_lost')
    .reduce((a, o) => a + o.value, 0);
  const lastRun = payrollRuns[0] as typeof payrollRuns[0] | undefined;
  const receivables = invoices
    .filter(i => i.status !== 'cancelled' && i.status !== 'draft')
    .reduce((a, i) => a + i.balance, 0);
  const pendingApprovals = [
    { label: 'Leave requests', count: leaveRequests.filter(request => request.status === 'pending').length, path: '/leave' },
    { label: 'Expense claims', count: 8, path: '/finance/expenses' },
    { label: 'Payroll review', count: payrollRuns.filter(r => r.status === 'draft').length, path: '/payroll' },
    { label: 'Overdue invoices', count: invoices.filter(i => i.status === 'past_due').length, path: '/customers/invoices' },
    { label: 'Role changes', count: 2, path: '/settings/roles' },
  ];
  const servicePosture = [
    { label: 'Identity & Access', value: 'RBAC enforced', tone: 'green' as const, icon: <ShieldCheck className="h-3.5 w-3.5" /> },
    { label: 'Workflow Engine', value: '14 active automations', tone: 'blue' as const, icon: <Zap className="h-3.5 w-3.5" /> },
    { label: 'Data Sync', value: '2 queues degraded', tone: 'amber' as const, icon: <Database className="h-3.5 w-3.5" /> },
  ];
  const modules = [
    { name: 'HR Directory', status: 'active', detail: `${totalHeadcount} active identities`, progress: 96 },
    { name: 'Payroll Engine', status: lastRun?.status ?? 'draft', detail: lastRun ? `Next pay date ${lastRun.payDate}` : 'No runs yet', progress: 82 },
    { name: 'CRM Pipeline', status: 'qualified', detail: `${formatCurrency(openPipeline)} open value`, progress: 68 },
    { name: 'Support Desk', status: urgentTickets > 0 ? 'at_risk' : 'met', detail: `${activeTickets} active tickets`, progress: urgentTickets > 0 ? 41 : 88 },
  ];

  return (
    <div>
      <PageHeader
        title="Operational Overview"
        description="Control surface for workforce, payroll, revenue operations, and exception handling across GuideOS."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => navigate('/activity')}>View event stream</Button>
            <Button size="sm" variant="secondary" leftIcon={<Zap className="h-3.5 w-3.5" />} onClick={() => navigate('/workflows')}>Open automations</Button>
          </>
        }
      />

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-4">
          <Card className="overflow-hidden">
            <CardBody className="p-0">
              <div className="px-4 sm:px-5 py-4 border-b border-ink-200/80 bg-[linear-gradient(135deg,rgba(15,23,42,0.03),rgba(37,99,235,0.07))]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="tech-label text-ink-500">Control Plane</p>
                    <h2 className="mt-2 text-lg sm:text-xl lg:text-2xl font-semibold tracking-[-0.03em] text-ink-900">Production workspace is stable with minor review backlog.</h2>
                    <p className="mt-2 text-xs sm:text-sm text-ink-600 max-w-2xl">
                      Identity, payroll, and support services are reachable. Two operational queues need manual attention before the next payroll cutoff.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {servicePosture.map(item => (
                      <Badge key={item.label} tone={item.tone} className="px-2.5 py-1.5">
                        {item.icon}
                        {item.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-ink-200/70">
                <ConsoleMetric label="Pending approvals" value="16" detail="Cross-module queue" />
                <ConsoleMetric label="Change velocity" value="24 events/hr" detail="Average over 6 hours" />
                <ConsoleMetric label="Exception rate" value="1.8%" detail="Below internal threshold" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Action Queue" subtitle="Items requiring operator review in the next cycle" />
            <CardBody className="p-0">
              <div className="divide-y divide-ink-100">
                {pendingApprovals.map(item => (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center justify-between gap-3 px-4 sm:px-5 py-3 text-left hover:bg-brand-50/30 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink-900 truncate">{item.label}</p>
                      <p className="text-[11px] text-ink-500 truncate">Requires acknowledgment or disposition</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-lg font-semibold text-ink-900">{item.count}</span>
                      <ChevronRight className="h-4 w-4 text-ink-400" />
                    </div>
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Stat label="Directory Objects" value={String(totalHeadcount)} delta="3 identities added this month" tone="green" />
          <Stat label="Revenue Pipeline" value={formatCurrency(openPipeline)} delta={`${formatCurrency(receivables)} in receivables`} tone="green" />
          <Stat label="Support Backlog" value={String(activeTickets)} delta={`${urgentTickets} urgent cases`} tone="red" />
          <Stat label="Payroll Release" value={lastRun ? formatCurrency(lastRun.net) : '—'} delta={lastRun ? `Window ${lastRun.payDate}` : 'No runs yet'} tone="gray" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-4">
          <Card>
            <CardHeader
              title="Module Posture"
              subtitle="Operational status by surface"
              action={<button onClick={() => navigate('/integrations')} className="text-[11px] font-mono uppercase tracking-[0.08em] text-brand-700 hover:text-brand-800">Integration map</button>}
            />
            <CardBody className="p-0">
              <div className="divide-y divide-ink-100">
                {modules.map(module => (
                  <div key={module.name} className="px-4 sm:px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-ink-900">{module.name}</p>
                          <StatusBadge status={module.status} />
                        </div>
                        <p className="text-[11px] text-ink-500 mt-1">{module.detail}</p>
                      </div>
                      <div className="text-right min-w-[72px] sm:min-w-[90px] flex-shrink-0">
                        <p className="tech-label text-ink-400">Utilization</p>
                        <p className="text-sm font-semibold text-ink-900 mt-1">{module.progress}%</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <ProgressBar value={module.progress} tone={module.progress >= 85 ? 'green' : module.progress >= 60 ? 'brand' : 'amber'} />
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="System Notes" subtitle="Short-form posture and platform flags" />
            <CardBody className="space-y-3">
              <StatusLine icon={<AlertTriangle className="h-4 w-4 text-amber-600" />} title="Compliance watchlist" body="PAYE filing for May remains overdue and should be closed before monthly payroll approval." />
              <StatusLine icon={<Network className="h-4 w-4 text-brand-600" />} title="CRM activity spike" body="Negotiation-stage opportunities increased in the last 48 hours; routing rules may need adjustment." />
              <StatusLine icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />} title="Identity sync healthy" body="No user provisioning failures detected in the current review window." />
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-4">
          <Card>
            <CardHeader
              title="Event Stream"
              subtitle="Most recent activity emitted by GuideOS modules"
              action={<button onClick={() => navigate('/activity')} className="text-[11px] font-mono uppercase tracking-[0.08em] text-brand-700 hover:text-brand-800">Open full feed</button>}
            />
            <CardBody className="p-0">
              <div className="divide-y divide-ink-100">
                {activities.slice(0, 8).map(a => (
                  <div key={a.id} className="px-4 sm:px-5 py-3.5 flex items-start gap-3 hover:bg-brand-50/20 transition-colors">
                    <Avatar name={a.actor} size={34} />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm text-ink-700">
                          <span className="font-medium text-ink-900">{a.actor}</span> {a.action}{' '}
                          <span className="text-ink-600">{a.target}</span>
                        </p>
                        <Badge tone={a.module.toLowerCase().includes('pay') ? 'green' : 'blue'}>{a.module}</Badge>
                      </div>
                      <p className="text-[11px] text-ink-400 mt-1">{relativeTime(a.timestamp)} • event type `{a.type}`</p>
                    </div>
                    <span className="hidden sm:block text-[11px] font-mono uppercase tracking-[0.08em] text-ink-400 flex-shrink-0">
                      {new Date(a.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Attention Surfaces" subtitle="Hotspots across revenue, support, and payroll" />
            <CardBody className="space-y-3">
              {opportunities.slice(0, 3).map(o => (
                <SignalRow
                  key={o.id}
                  icon={<Briefcase className="h-4 w-4 text-brand-600" />}
                  title={o.name}
                  body={`${o.company} • ${formatCurrency(o.value)} • ${o.probability}% probability`}
                  action="Review deal"
                  onClick={() => navigate('/crm/opportunities')}
                />
              ))}
              {tickets.slice(0, 2).map(t => (
                <SignalRow
                  key={t.id}
                  icon={<Ticket className="h-4 w-4 text-red-600" />}
                  title={t.subject}
                  body={`${t.requester} • ${t.category} • ${relativeTime(t.updatedAt)}`}
                  action="Open ticket"
                  onClick={() => navigate('/support/tickets')}
                />
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ConsoleMetric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="bg-white/70 px-4 sm:px-5 py-4">
      <p className="tech-label text-ink-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-ink-900">{value}</p>
      <p className="mt-1 text-[11px] text-ink-500">{detail}</p>
    </div>
  );
}

function StatusLine({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-xl border border-ink-200 bg-white/70 px-4 py-3">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex-shrink-0">{icon}</span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink-900">{title}</p>
          <p className="text-[11px] text-ink-500 mt-1 leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  );
}

function SignalRow({
  icon,
  title,
  body,
  action,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <div className="rounded-xl border border-ink-200 bg-white/70 px-4 py-3">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex-shrink-0">{icon}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-ink-900 break-words">{title}</p>
          <p className="text-[11px] text-ink-500 mt-1">{body}</p>
          <button onClick={onClick} className="mt-2 inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-[0.08em] text-brand-700 hover:text-brand-800">
            {action} <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function ActivityFeedPage() {
  return (
    <div>
      <PageHeader title="Event Stream" description="Normalized system events across GuideOS operational surfaces." />
      <div className="p-4 sm:p-6">
        <Card>
          <CardBody className="p-0">
            <div className="divide-y divide-ink-100">
              {activities.map(a => (
                <div key={a.id} className="px-4 sm:px-5 py-3.5 flex items-start gap-3 hover:bg-brand-50/20 transition-colors">
                  <Avatar name={a.actor} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink-700">
                      <span className="font-medium text-ink-900">{a.actor}</span> {a.action}{' '}
                      <span className="text-ink-600">{a.target}</span>
                    </p>
                    <p className="text-[11px] text-ink-400 mt-1">{a.module} • {relativeTime(a.timestamp)} • `{a.type}`</p>
                  </div>
                  <span className="hidden sm:block text-[11px] font-mono uppercase tracking-[0.08em] text-ink-400 flex-shrink-0">
                    {new Date(a.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export function NotificationsPage() {
  const { notifications, markAllNotificationsRead } = useMockData();
  const toneClass: Record<string, string> = {
    amber: 'bg-amber-50 text-amber-600', blue: 'bg-brand-50 text-brand-600', red: 'bg-red-50 text-red-600', green: 'bg-emerald-50 text-emerald-600',
  };
  return (
    <div>
      <PageHeader title="Notifications" description={`${notifications.filter(notification => !notification.read).length} unread operator notifications and module exceptions.`} actions={<button onClick={markAllNotificationsRead} className="text-[11px] font-mono uppercase tracking-[0.08em] text-brand-700 hover:text-brand-800">Mark all as read</button>} />
      <div className="p-4 sm:p-6">
        <Card>
          <CardBody className="p-0">
            <div className="divide-y divide-ink-100">
              {notifications.map(n => (
                <div key={n.id} className={['px-4 sm:px-5 py-4 hover:bg-brand-50/20 transition-colors flex items-start gap-3', n.read ? 'opacity-70' : ''].join(' ')}>
                  <span className={['h-8 w-8 rounded-md flex items-center justify-center flex-shrink-0', toneClass[n.tone]].join(' ')}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-medium text-ink-900">{n.title}</p>
                      <Badge tone={n.tone === 'red' ? 'red' : n.tone === 'green' ? 'green' : n.tone === 'blue' ? 'blue' : 'amber'}>{n.module}</Badge>
                    </div>
                    <p className="text-xs text-ink-500 mt-1 leading-relaxed">{n.body}</p>
                    <p className="text-[11px] text-ink-400 mt-2">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
