import { useState } from 'react';
import { TrendingUp, TrendingDown, Users, DollarSign, Briefcase, Ticket, ArrowUpRight, ChevronRight, Activity as ActivityIcon, Zap } from 'lucide-react';
import { Card, CardHeader, CardBody, Stat, Avatar, PageHeader } from '../../components/ui';
import { StatusBadge, ProgressBar } from '../../components/ui/Filters';
import { activities, employees, payrollRuns, tickets, opportunities, formatCurrency, relativeTime, fullName } from '../../data/seed';
import type { RouteProps } from '../../lib/types';

export function DashboardPage({ navigate }: RouteProps) {
  const totalHeadcount = employees.filter(e => e.status !== 'inactive').length;
  const activeTickets = tickets.filter(t => t.status === 'open' || t.status === 'pending').length;
  const openPipeline = opportunities.filter(o => o.stage !== 'closed_won' && o.stage !== 'closed_lost').reduce((a, o) => a + o.value, 0);
  const lastRun = payrollRuns[0];

  return (
    <div>
      <PageHeader
        title="Good morning, Fatima"
        description="Here's what's happening across GuideOS today, June 20, 2025."
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Total Headcount" value={String(totalHeadcount)} delta="+3 this month" tone="green" />
          <Stat label="Open Pipeline" value={formatCurrency(openPipeline)} delta="$28k new" tone="green" />
          <Stat label="Active Tickets" value={String(activeTickets)} delta="2 urgent" tone="red" />
          <Stat label="Next Payroll" value={formatCurrency(lastRun.net)} delta={lastRun.payDate} tone="gray" />
        </div>

        {/* Activity + quick panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader
              title="Recent Activity"
              action={<button onClick={() => navigate('/activity')} className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">View all <ChevronRight className="h-3 w-3" /></button>}
            />
            <CardBody className="p-0">
              <div className="divide-y divide-ink-100">
                {activities.slice(0, 7).map(a => (
                  <div key={a.id} className="px-5 py-3 flex items-start gap-3 hover:bg-ink-50/50 transition-colors">
                    <Avatar name={a.actor} size={32} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-ink-700">
                        <span className="font-medium text-ink-900">{a.actor}</span> {a.action}{' '}
                        <span className="text-ink-600">{a.target}</span>
                      </p>
                      <p className="text-[11px] text-ink-400 mt-0.5">
                        <span className="inline-flex items-center gap-1"><StatusBadge status={a.module.toLowerCase().includes('pay') ? 'paid' : 'active'} label={a.module} /> {relativeTime(a.timestamp)}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Open Opportunities" />
            <CardBody className="p-0">
              <div className="divide-y divide-ink-100">
                {opportunities.slice(0, 5).map(o => (
                  <div key={o.id} onClick={() => navigate(`/crm/opportunities`)} className="px-5 py-3 cursor-pointer hover:bg-ink-50/50">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-ink-900 truncate">{o.name}</p>
                        <p className="text-[11px] text-ink-500">{o.company}</p>
                      </div>
                      <span className="text-xs font-semibold text-ink-900 flex-shrink-0">{formatCurrency(o.value)}</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <ProgressBar value={o.probability} tone={o.stage === 'closed_lost' ? 'red' : 'brand'} />
                      <span className="text-[10px] text-ink-500 flex-shrink-0">{o.probability}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Hot tickets + quick actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader title="Tickets Needing Attention" action={<button onClick={() => navigate('/support/tickets')} className="text-xs text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">All tickets <ChevronRight className="h-3 w-3" /></button>} />
            <CardBody className="p-0">
              <div className="divide-y divide-ink-100">
                {tickets.slice(0, 5).map(t => (
                  <div key={t.id} onClick={() => navigate('/support/tickets')} className="px-5 py-3 cursor-pointer hover:bg-ink-50/50 flex items-center gap-3">
                    <StatusBadge status={t.priority === 'urgent' ? 'breached' : t.sla} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-ink-900 truncate">{t.subject}</p>
                      <p className="text-[11px] text-ink-500">{t.requester} • {t.category}</p>
                    </div>
                    <span className="text-[11px] text-ink-400 flex-shrink-0">{relativeTime(t.updatedAt)}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Quick Actions" />
            <CardBody className="grid grid-cols-2 gap-2">
              <QuickAction icon={<Users className="h-4 w-4" />} label="New Hire" onClick={() => navigate('/onboarding')} />
              <QuickAction icon={<DollarSign className="h-4 w-4" />} label="Run Payroll" onClick={() => navigate('/payroll')} />
              <QuickAction icon={<Briefcase className="h-4 w-4" />} label="Add Lead" onClick={() => navigate('/crm/leads')} />
              <QuickAction icon={<Ticket className="h-4 w-4" />} label="New Ticket" onClick={() => navigate('/support/tickets')} />
              <QuickAction icon={<ActivityIcon className="h-4 w-4" />} label="Activity" onClick={() => navigate('/activity')} />
              <QuickAction icon={<Zap className="h-4 w-4" />} label="Workflows" onClick={() => navigate('/workflows')} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex flex-col items-start gap-3 p-3 rounded-lg border border-ink-200 hover:border-brand-300 hover:bg-brand-50/50 transition-colors group">
      <span className="h-8 w-8 rounded-lg bg-ink-100 text-ink-600 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center transition-colors">{icon}</span>
      <span className="text-xs font-medium text-ink-700 group-hover:text-ink-900">{label}</span>
    </button>
  );
}

export function ActivityFeedPage() {
  return (
    <div>
      <PageHeader title="Activity Feed" description="All system events across GuideOS modules." />
      <div className="p-6">
        <Card>
          <CardBody className="p-0">
            <div className="divide-y divide-ink-100">
              {activities.map(a => (
                <div key={a.id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-ink-50/50 transition-colors">
                  <Avatar name={a.actor} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink-700">
                      <span className="font-medium text-ink-900">{a.actor}</span> {a.action}{' '}
                      <span className="text-ink-600">{a.target}</span>
                    </p>
                    <p className="text-[11px] text-ink-400 mt-0.5">{a.module} • {relativeTime(a.timestamp)}</p>
                  </div>
                  <span className="text-[11px] text-ink-400 flex-shrink-0">{new Date(a.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
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
  const notifs = [
    { id: 1, title: '5 leave requests pending approval', body: 'Tunde, Chioma, and 3 others have requested leave that requires your approval.', time: '2h ago', tone: 'amber', module: 'Leave' },
    { id: 2, title: 'Payroll run for June 2025 is ready to review', body: 'Fatima has submitted the payroll run. Approval needed before June 28.', time: '5h ago', tone: 'blue', module: 'Payroll' },
    { id: 3, title: '2 urgent support tickets unassigned', body: 'Tickets related to login and payslip download have not been picked up.', time: '6h ago', tone: 'red', module: 'Support' },
    { id: 4, title: 'New hire onboarding complete: Adaobi Okoye', body: 'All 9 checklist steps completed. Welcome packet sent.', time: '1d ago', tone: 'green', module: 'Onboarding' },
    { id: 5, title: 'Compliance: PAYE filing overdue for May', body: 'Filing due June 10. Please review and file immediately.', time: '1d ago', tone: 'red', module: 'Compliance' },
    { id: 6, title: 'New opportunity in negotiation stage', body: 'GuideOS Enterprise deal worth $145k moved to Negotiation.', time: '2d ago', tone: 'amber', module: 'CRM' },
    { id: 7, title: '8 expense reports awaiting approval', body: 'Total value: $4,231 across 6 employees.', time: '2d ago', tone: 'amber', module: 'Finance' },
  ];
  const toneClass: Record<string, string> = {
    amber: 'bg-amber-50 text-amber-600', blue: 'bg-brand-50 text-brand-600', red: 'bg-red-50 text-red-600', green: 'bg-emerald-50 text-emerald-600',
  };
  return (
    <div>
      <PageHeader title="Notifications" description="7 unread notifications across all modules." actions={<button className="text-xs text-brand-600 hover:text-brand-700 font-medium">Mark all as read</button>} />
      <div className="p-6">
        <Card>
          <CardBody className="p-0">
            <div className="divide-y divide-ink-100">
              {notifs.map(n => (
                <div key={n.id} className="px-5 py-4 hover:bg-ink-50/50 transition-colors flex items-start gap-3">
                  <span className={['h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0', toneClass[n.tone]].join(' ')}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink-900">{n.title}</p>
                    <p className="text-xs text-ink-500 mt-0.5 leading-relaxed">{n.body}</p>
                    <p className="text-[11px] text-ink-400 mt-1">{n.module} • {n.time}</p>
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
