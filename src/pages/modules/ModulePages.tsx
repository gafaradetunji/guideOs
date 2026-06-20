import { useState } from 'react';
import { Plus, Search, Download, Mail, Phone, MapPin, Star, Calendar, ChevronRight, Laptop, Smartphone, Monitor, Keyboard, Mouse, Package, Filter, Check, X } from 'lucide-react';
import { PageHeader, Breadcrumbs, Card, CardHeader, CardBody, Avatar, Button, Input, Table, THead, Th, TBody, Tr, Td, EmptyState, Badge } from '../../components/ui';
import { FilterSelect, StatusBadge, ProgressBar, Pagination, Checkbox } from '../../components/ui/Filters';
import { Drawer, Modal } from '../../components/ui/Overlays';
import {
  leaveRequests, assets, tickets, articles, projects, candidates, positions, expenses, complianceItems,
  employees, departments, payrollRuns, formatCurrency, formatDate, fullName, getEmployee, relativeTime,
} from '../../data/seed';
import type { RouteProps } from '../../lib/types';

const assetIcon = (t: string) => {
  switch (t) {
    case 'laptop': return <Laptop className="h-4 w-4" />;
    case 'phone': return <Smartphone className="h-4 w-4" />;
    case 'monitor': return <Monitor className="h-4 w-4" />;
    case 'peripheral': return <Mouse className="h-4 w-4" />;
    case 'accessory': return <Keyboard className="h-4 w-4" />;
    default: return <Package className="h-4 w-4" />;
  }
};

/* ============ LEAVE ============ */
export function LeaveRequestsPage({ navigate }: RouteProps) {
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [drawerLeave, setDrawerLeave] = useState<typeof leaveRequests[0] | null>(null);
  const filtered = leaveRequests.filter(l => {
    if (typeFilter && l.type !== typeFilter) return false;
    if (statusFilter && l.status !== statusFilter) return false;
    return true;
  });
  const pending = leaveRequests.filter(l => l.status === 'pending').length;

  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Leave Management' }]} />} title="Leave Requests" description={`${pending} pending approval`} actions={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>Request Leave</Button>} />
      <div className="px-5 py-3 border-b border-ink-200 bg-white flex flex-wrap gap-2">
        <FilterSelect label="Type" value={typeFilter} onChange={setTypeFilter} options={['annual','sick','compassionate','maternity','paternity','unpaid'].map(t => ({value:t,label:t.charAt(0).toUpperCase()+t.slice(1)}))} />
        <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={[{value:'pending',label:'Pending'},{value:'approved',label:'Approved'},{value:'rejected',label:'Rejected'},{value:'cancelled',label:'Cancelled'}]} />
      </div>
      <div className="bg-white">
        <Table>
          <THead><tr><Th>Employee</Th><Th>Type</Th><Th>Dates</Th><Th>Days</Th><Th>Reason</Th><Th>Status</Th><Th>Approver</Th></tr></THead>
          <TBody>
            {filtered.map(l => {
              const emp = getEmployee(l.employeeId);
              return (
                <Tr key={l.id} onClick={() => setDrawerLeave(l)}>
                  <Td><div className="flex items-center gap-2"><Avatar name={emp ? fullName(emp) : 'Unknown'} size={28} /><span className="text-sm font-medium text-ink-900">{emp ? fullName(emp) : 'Unknown'}</span></div></Td>
                  <Td><span className="capitalize text-sm">{l.type}</span></Td>
                  <Td className="text-sm text-ink-500">{formatDate(l.startDate)} → {formatDate(l.endDate)}</Td>
                  <Td className="text-sm font-medium">{l.days}</Td>
                  <Td className="text-sm text-ink-600 max-w-[200px] truncate">{l.reason}</Td>
                  <Td><StatusBadge status={l.status} /></Td>
                  <Td className="text-sm text-ink-500">{emp ? getDepartment(emp.departmentId)?.name : '—'}</Td>
                </Tr>
              );
            })}
          </TBody>
        </Table>
      </div>

      <Drawer open={!!drawerLeave} onClose={() => setDrawerLeave(null)} title="Leave Request" footer={
        <>
          <Button variant="danger" size="sm" leftIcon={<X className="h-3.5 w-3.5" />} onClick={() => setDrawerLeave(null)}>Reject</Button>
          <Button size="sm" leftIcon={<Check className="h-3.5 w-3.5" />} onClick={() => setDrawerLeave(null)}>Approve</Button>
        </>
      }>
        {drawerLeave && (() => {
          const emp = getEmployee(drawerLeave.employeeId);
          return (
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3"><Avatar name={emp ? fullName(emp) : 'Unknown'} size={48} /><div><p className="text-base font-semibold text-ink-900">{emp ? fullName(emp) : 'Unknown'}</p><p className="text-[11px] text-ink-500">{emp?.jobTitle}</p></div></div>
              <div className="grid grid-cols-2 gap-3">
                <Detail label="Type" value={<span className="capitalize">{drawerLeave.type}</span>} />
                <Detail label="Days" value={String(drawerLeave.days)} />
                <Detail label="Start" value={formatDate(drawerLeave.startDate)} />
                <Detail label="End" value={formatDate(drawerLeave.endDate)} />
                <Detail label="Status" value={<StatusBadge status={drawerLeave.status} />} />
                <Detail label="Requester Dept" value={getDepartment(emp?.departmentId || '')?.name || '—'} />
              </div>
              <div><p className="text-xs text-ink-500 mb-1">Reason</p><p className="text-sm text-ink-900">{drawerLeave.reason}</p></div>
            </div>
          );
        })()}
      </Drawer>
    </div>
  );
}
function getDepartment(id: string) { return departments.find(d => d.id === id); }
function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="p-3 bg-ink-50 rounded-lg"><p className="text-[11px] text-ink-500">{label}</p><p className="text-sm text-ink-900 mt-0.5">{value}</p></div>;
}

export function LeaveCalendarPage({ navigate }: RouteProps) {
  const today = new Date(2025, 5, 20);
  const days = Array.from({ length: 35 }).map((_, i) => new Date(2025, 5, i - 0));
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Leave Management', onClick: () => navigate('/leave') }, { label: 'Calendar' }]} />} title="Leave Calendar" description="June 2025" actions={<div className="flex items-center gap-1"><Button variant="ghost" size="icon"><ChevronRight className="h-4 w-4 rotate-180" /></Button><Button variant="ghost" size="icon"><ChevronRight className="h-4 w-4" /></Button></div>} />
      <div className="p-6">
        <Card>
          <CardBody>
            <div className="grid grid-cols-7 mb-2">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d} className="text-center text-[11px] font-semibold uppercase text-ink-500 py-2">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {days.map((d, i) => {
                const isToday = d.toDateString() === today.toDateString();
                const dayLeaves = leaveRequests.filter(l => new Date(l.startDate) <= d && new Date(l.endDate) >= d).slice(0, 2);
                const isCurrentMonth = d.getMonth() === 5;
                return (
                  <div key={i} className={['min-h-[80px] p-1.5 rounded-lg border', isToday ? 'bg-brand-50 border-brand-200' : 'border-ink-100', !isCurrentMonth && 'opacity-40'].join(' ')}>
                    <p className="text-[11px] text-ink-500 mb-1">{d.getDate()}</p>
                    {dayLeaves.map(l => {
                      const emp = getEmployee(l.employeeId);
                      return emp ? <div key={l.id} className="text-[10px] truncate px-1.5 py-0.5 mb-0.5 rounded bg-brand-100 text-brand-700">{emp.firstName}</div> : null;
                    })}
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

/* ============ ASSETS ============ */
export function AssetsPage({ navigate }: RouteProps) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [assignAsset, setAssignAsset] = useState<typeof assets[0] | null>(null);
  const [showAddAsset, setShowAddAsset] = useState(false);
  const filtered = assets.filter(a => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.serial.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter && a.type !== typeFilter) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    return true;
  });
  const stats = { total: assets.length, assigned: assets.filter(a => a.status === 'assigned').length, available: assets.filter(a => a.status === 'available').length, inRepair: assets.filter(a => a.status === 'in_repair').length };

  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Assets' }]} />} title="Asset Management" description={`${stats.total} assets • ${stats.assigned} assigned • ${stats.available} available`} actions={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => setShowAddAsset(true)}>Add Asset</Button>} />
      <div className="px-5 py-3 border-b border-ink-200 bg-white flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search assets, serial..." className="pl-9" />
        </div>
        <FilterSelect label="Type" value={typeFilter} onChange={setTypeFilter} options={['laptop','phone','monitor','accessory','software','peripheral'].map(t => ({value:t,label:t.charAt(0).toUpperCase()+t.slice(1)}))} />
        <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={[{value:'available',label:'Available'},{value:'assigned',label:'Assigned'},{value:'in_repair',label:'In Repair'},{value:'retired',label:'Retired'}]} />
      </div>
      <div className="bg-white">
        <Table>
          <THead><tr><Th>Asset</Th><Th>Type</Th><Th>Serial</Th><Th>Assignee</Th><Th>Location</Th><Th>Value</Th><Th>Status</Th><Th></Th></tr></THead>
          <TBody>
            {filtered.map(a => (
              <Tr key={a.id} onClick={() => setAssignAsset(a)}>
                <Td><div className="flex items-center gap-2"><span className="h-8 w-8 rounded-lg bg-ink-100 text-ink-600 flex items-center justify-center">{assetIcon(a.type)}</span><div><p className="text-sm font-medium text-ink-900">{a.name}</p><p className="text-[11px] text-ink-500">{a.brand} {a.model}</p></div></div></Td>
                <Td><span className="capitalize text-sm">{a.type}</span></Td>
                <Td className="text-sm font-mono text-ink-500">{a.serial}</Td>
                <Td>{a.assigneeId ? (() => { const e = getEmployee(a.assigneeId); return e ? <div className="flex items-center gap-2"><Avatar name={fullName(e)} size={24} /><span className="text-sm">{fullName(e)}</span></div> : null; })() : <span className="text-sm text-ink-400">—</span>}</Td>
                <Td className="text-sm">{a.location}</Td>
                <Td className="text-sm font-medium">{formatCurrency(a.purchaseValue)}</Td>
                <Td><StatusBadge status={a.status} /></Td>
                <Td><Button variant="ghost" size="xs">Edit</Button></Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>

      <Drawer open={!!assignAsset} onClose={() => setAssignAsset(null)} title={assignAsset?.name} description={assignAsset ? `${assignAsset.brand} ${assignAsset.model} • ${assignAsset.serial}` : ''} footer={<><Button variant="ghost" size="sm" onClick={() => setAssignAsset(null)}>Close</Button><Button size="sm" disabled={assignAsset?.status === 'assigned'}>Assign to Employee</Button></>}>
        {assignAsset && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3"><span className="h-12 w-12 rounded-lg bg-ink-100 text-ink-600 flex items-center justify-center">{assetIcon(assignAsset.type)}</span><div><StatusBadge status={assignAsset.status} /></div></div>
            <div className="grid grid-cols-2 gap-3">
              <Detail label="Purchase Date" value={formatDate(assignAsset.purchaseDate)} />
              <Detail label="Purchase Value" value={formatCurrency(assignAsset.purchaseValue)} />
              <Detail label="Location" value={assignAsset.location} />
              <Detail label="Assigned To" value={assignAsset.assigneeId ? (getEmployee(assignAsset.assigneeId) ? fullName(getEmployee(assignAsset.assigneeId)!) : '—') : '—'} />
            </div>
          </div>
        )}
      </Drawer>

      <Modal open={showAddAsset} onClose={() => setShowAddAsset(false)} title="Add New Asset" description="Register a new asset to your inventory" footer={<><Button variant="ghost" size="sm" onClick={() => setShowAddAsset(false)}>Cancel</Button><Button size="sm" onClick={() => setShowAddAsset(false)}>Create Asset</Button></>}>
        <div className="space-y-3">
          <div><label className="block text-xs font-medium text-ink-700 mb-1.5">Asset Name *</label><Input placeholder="MacBook Pro 14&quot;" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs font-medium text-ink-700 mb-1.5">Type *</label><select className="h-9 w-full rounded-lg border border-ink-200 px-3 text-sm"><option>Laptop</option><option>Phone</option><option>Monitor</option><option>Accessory</option></select></div>
            <div><label className="block text-xs font-medium text-ink-700 mb-1.5">Brand *</label><Input placeholder="Apple" /></div>
            <div><label className="block text-xs font-medium text-ink-700 mb-1.5">Model</label><Input placeholder="M3 2024" /></div>
            <div><label className="block text-xs font-medium text-ink-700 mb-1.5">Serial #</label><Input placeholder="SN000000" /></div>
            <div><label className="block text-xs font-medium text-ink-700 mb-1.5">Purchase Value</label><Input type="number" placeholder="2000" /></div>
            <div><label className="block text-xs font-medium text-ink-700 mb-1.5">Location</label><Input placeholder="HQ - Lagos" /></div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export function AssetsAssignedPage({ navigate }: RouteProps) {
  const assigned = assets.filter(a => a.status === 'assigned');
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Assets', onClick: () => navigate('/assets') }, { label: 'Assigned' }]} />} title="Assigned Assets" description={`${assigned.length} assets currently assigned to employees`} />
      <div className="bg-white">
        <Table>
          <THead><tr><Th>Asset</Th><Th>Serial</Th><Th>Assignee</Th><Th>Department</Th><Th>Assigned On</Th><Th>Value</Th></tr></THead>
          <TBody>
            {assigned.map(a => {
              const emp = a.assigneeId ? getEmployee(a.assigneeId) : undefined;
              const dept = emp ? getDepartment(emp.departmentId) : undefined;
              return (
                <Tr key={a.id} onClick={() => navigate('/assets')}>
                  <Td><div className="flex items-center gap-2"><span className="h-8 w-8 rounded-lg bg-ink-100 text-ink-600 flex items-center justify-center">{assetIcon(a.type)}</span><span className="text-sm font-medium text-ink-900">{a.name}</span></div></Td>
                  <Td className="text-sm font-mono text-ink-500">{a.serial}</Td>
                  <Td><div className="flex items-center gap-2">{emp && <Avatar name={fullName(emp)} size={24} />}<span className="text-sm">{emp ? fullName(emp) : '—'}</span></div></Td>
                  <Td className="text-sm">{dept?.name || '—'}</Td>
                  <Td className="text-sm text-ink-500">{a.assignedAt ? formatDate(a.assignedAt) : '—'}</Td>
                  <Td className="text-sm font-medium">{formatCurrency(a.purchaseValue)}</Td>
                </Tr>
              );
            })}
          </TBody>
        </Table>
      </div>
    </div>
  );
}

/* ============ SUPPORT ============ */
export function TicketsPage({ navigate }: RouteProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const filtered = tickets.filter(t => {
    if (search && !t.subject.toLowerCase().includes(search.toLowerCase()) && !t.requester.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && t.status !== statusFilter) return false;
    if (priorityFilter && t.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Support' }]} />} title="Support Tickets" description={`${filtered.length} tickets • ${tickets.filter(t => t.status === 'open').length} open`} actions={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>New Ticket</Button>} />
      <div className="px-5 py-3 border-b border-ink-200 bg-white flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tickets..." className="pl-9" />
        </div>
        <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={['open','pending','on_hold','resolved','closed'].map(s => ({value:s,label:s.replace('_',' ').replace(/\b\w/g,c=>c.toUpperCase())}))} />
        <FilterSelect label="Priority" value={priorityFilter} onChange={setPriorityFilter} options={['low','medium','high','urgent'].map(s => ({value:s,label:s.charAt(0).toUpperCase()+s.slice(1)}))} />
      </div>
      <div className="bg-white">
        <Table>
          <THead><tr><Th>Ticket ID</Th><Th>Subject</Th><Th>Requester</Th><Th>Category</Th><Th>Priority</Th><Th>SLA</Th><Th>Status</Th><Th>Updated</Th></tr></THead>
          <TBody>
            {filtered.map(t => (
              <Tr key={t.id}>
                <Td className="text-sm font-mono text-ink-500">{t.id}</Td>
                <Td><div><p className="text-sm font-medium text-ink-900">{t.subject}</p><p className="text-[11px] text-ink-500">{t.requesterEmail} • {t.channel}</p></div></Td>
                <Td className="text-sm">{t.requester}</Td>
                <Td><span className="text-xs font-medium px-2 py-0.5 rounded-md bg-ink-100 text-ink-700">{t.category}</span></Td>
                <Td><StatusBadge status={t.priority === 'urgent' ? 'breached' : t.priority === 'high' ? 'at_risk' : t.priority === 'medium' ? 'pending' : 'open'} label={t.priority} /></Td>
                <Td><StatusBadge status={t.sla} /></Td>
                <Td><StatusBadge status={t.status} /></Td>
                <Td className="text-sm text-ink-500">{relativeTime(t.updatedAt)}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}

export function EscalationsPage({ navigate }: RouteProps) {
  const escalated = tickets.filter(t => t.priority === 'urgent' || t.sla === 'breached');
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Support', onClick: () => navigate('/support/tickets') }, { label: 'Escalations' }]} />} title="Escalations" description={`${escalated.length} escalated tickets requiring immediate attention`} />
      <div className="bg-white">
        {escalated.length === 0 ? <EmptyState icon={<Check className="h-6 w-6" />} title="No escalations. You're all caught up!" /> : (
          <Table>
            <THead><tr><Th>Ticket</Th><Th>Requester</Th><Th>SLA</Th><Th>Category</Th><Th>Status</Th><Th>Updated</Th></tr></THead>
            <TBody>
              {escalated.map(t => (
                <Tr key={t.id} onClick={() => navigate('/support/tickets')}>
                  <Td><div><p className="text-sm font-medium text-ink-900">{t.subject}</p><p className="text-[11px] font-mono text-ink-500">{t.id}</p></div></Td>
                  <Td className="text-sm">{t.requester}</Td>
                  <Td><StatusBadge status={t.sla} /></Td>
                  <Td className="text-sm">{t.category}</Td>
                  <Td><StatusBadge status={t.status} /></Td>
                  <Td className="text-sm text-ink-500">{relativeTime(t.updatedAt)}</Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        )}
      </div>
    </div>
  );
}

/* ============ KNOWLEDGE BASE ============ */
export function KnowledgeBasePage({ navigate }: RouteProps) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const filtered = articles.filter(a => {
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (catFilter && a.category !== catFilter) return false;
    return true;
  });
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Knowledge Base' }]} />} title="Knowledge Base" description={`${articles.length} articles • Training material for GuideAI`} actions={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>New Article</Button>} />
      <div className="px-5 py-3 border-b border-ink-200 bg-white flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search articles..." className="pl-9" />
        </div>
        <FilterSelect label="Category" value={catFilter} onChange={setCatFilter} options={['payroll','hr','crm','finance','it','policies'].map(c => ({value:c,label:c.toUpperCase()}))} />
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(a => (
          <Card key={a.id} className="hover:shadow-cardlg cursor-pointer">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Badge tone="blue">{a.category.toUpperCase()}</Badge>
                <StatusBadge status={a.status} />
              </div>
              <p className="text-sm font-medium text-ink-900 mb-1 line-clamp-2">{a.title}</p>
              <p className="text-xs text-ink-500 line-clamp-2">{a.summary}</p>
              <div className="mt-3 pt-3 border-t border-ink-100 flex items-center justify-between text-[11px] text-ink-500">
                <span>{a.author}</span>
                <span>{a.views} views • {a.helpful}% helpful</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============ PROJECTS ============ */
export function ProjectsPage({ navigate }: RouteProps) {
  const [boardIdx, setBoardIdx] = useState(0);
  const board = projects[boardIdx];
  const columns = [
    { id: 'todo', label: 'To Do', tone: 'gray' as const },
    { id: 'in_progress', label: 'In Progress', tone: 'blue' as const },
    { id: 'review', label: 'In Review', tone: 'amber' as const },
    { id: 'done', label: 'Done', tone: 'green' as const },
  ];
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Projects' }]} />} title="Project Boards" description="Kanban-style project tracking" actions={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>New Board</Button>} />
      <div className="px-5 py-2 border-b border-ink-200 bg-white flex items-center gap-1 overflow-x-auto">
        {projects.map((p, i) => (
          <button key={p.id} onClick={() => setBoardIdx(i)} className={i === boardIdx ? 'px-3 py-1.5 text-xs font-medium rounded-md bg-ink-900 text-white' : 'px-3 py-1.5 text-xs text-ink-600 hover:bg-ink-100 rounded-md'}>{p.name}</button>
        ))}
      </div>
      <div className="p-4 overflow-x-auto scrollbar-thin">
        <div className="flex gap-4 min-w-max">
          {columns.map(col => {
            const tasks = board.tasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="w-72 flex-shrink-0">
                <div className="flex items-center justify-between mb-2 px-2">
                  <StatusBadge status={col.id} label={col.label} />
                  <span className="text-xs text-ink-400">{tasks.length}</span>
                </div>
                <div className="space-y-2">
                  {tasks.map(t => (
                    <Card key={t.id} className="hover:shadow-cardlg cursor-pointer">
                      <div className="p-3">
                        <p className="text-sm font-medium text-ink-900">{t.title}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <StatusBadge status={t.priority === 'urgent' ? 'breached' : t.priority === 'high' ? 'at_risk' : 'open'} label={t.priority} />
                          <div className="flex flex-wrap gap-1">{t.tags.map(tag => <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-ink-100 text-ink-600 rounded">{tag}</span>)}</div>
                        </div>
                        <div className="mt-2.5 pt-2.5 border-t border-ink-100 flex items-center justify-between">
                          <Avatar name={t.assignee} size={20} />
                          <span className="text-[11px] text-ink-400 flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDate(t.dueDate)}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                  {tasks.length === 0 && <div className="border-2 border-dashed border-ink-200 rounded-lg py-6 text-center text-[11px] text-ink-400">No tasks</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============ RECRUITMENT ============ */
export function CandidatesPage({ navigate }: RouteProps) {
  const stages = ['applied','screening','interview','offer','hired','rejected'];
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Recruitment', onClick: () => navigate('/recruitment/candidates') }, { label: 'Candidates' }]} />} title="Candidates" description={`${candidates.length} candidates in pipeline`} actions={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>Add Candidate</Button>} />
      <div className="p-4 overflow-x-auto scrollbar-thin">
        <div className="flex gap-3 min-w-max">
          {stages.map(stage => {
            const items = candidates.filter(c => c.stage === stage);
            return (
              <div key={stage} className="w-72 flex-shrink-0">
                <div className="flex items-center justify-between mb-2 px-2">
                  <StatusBadge status={stage} />
                  <span className="text-xs text-ink-400">{items.length}</span>
                </div>
                <div className="space-y-2">
                  {items.map(c => (
                    <Card key={c.id} className="hover:shadow-cardlg cursor-pointer">
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar name={c.name} size={32} />
                          <div className="min-w-0"><p className="text-sm font-medium text-ink-900 truncate">{c.name}</p><p className="text-[11px] text-ink-500 truncate">{c.email}</p></div>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-ink-500">{c.source}</span>
                          <span className="flex items-center gap-0.5 text-amber-500"><Star className="h-3 w-3 fill-current" />{c.rating}.0</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function PositionsPage({ navigate }: RouteProps) {
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Recruitment', onClick: () => navigate('/recruitment/candidates') }, { label: 'Positions' }]} />} title="Job Positions" description={`${positions.length} open positions`} actions={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>New Position</Button>} />
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {positions.map(p => {
          const dept = getDepartment(p.departmentId);
          return (
            <Card key={p.id} className="hover:shadow-cardlg">
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div><p className="text-sm font-semibold text-ink-900">{p.title}</p><p className="text-[11px] text-ink-500">{dept?.name}</p></div>
                  <StatusBadge status={p.status} />
                </div>
                <div className="space-y-1.5 text-xs text-ink-600 mt-3">
                  <div className="flex justify-between"><span>Salary</span><span className="font-medium text-ink-900">{p.salaryRange}</span></div>
                  <div className="flex justify-between"><span>Location</span><span className="font-medium text-ink-900">{p.location}</span></div>
                  <div className="flex justify-between"><span>Type</span><span className="font-medium text-ink-900 capitalize">{p.type.replace('_',' ')}</span></div>
                  <div className="flex justify-between"><span>Hiring Manager</span><span className="font-medium text-ink-900">{p.hiringManager}</span></div>
                </div>
                <div className="mt-3 pt-3 border-t border-ink-100 flex items-center justify-between">
                  <span className="text-[11px] text-ink-500">{p.applicants} applicants</span>
                  <Button variant="outline" size="xs">View Pipeline</Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ============ FINANCE ============ */
export function ExpensesPage({ navigate }: RouteProps) {
  const [statusFilter, setStatusFilter] = useState('');
  const filtered = expenses.filter(e => !statusFilter || e.status === statusFilter);
  const pending = expenses.filter(e => e.status === 'submitted' || e.status === 'draft').length;
  const totalValue = expenses.reduce((a, e) => a + e.amount, 0);
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Finance', onClick: () => navigate('/finance/expenses') }, { label: 'Expenses' }]} />} title="Expense Reports" description={`${pending} pending • ${formatCurrency(totalValue)} submitted YTD`} actions={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>New Expense</Button>} />
      <div className="px-5 py-3 border-b border-ink-200 bg-white"><FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={['draft','submitted','approved','rejected','paid'].map(s => ({value:s,label:s.charAt(0).toUpperCase()+s.slice(1)}))} /></div>
      <div className="bg-white">
        <Table>
          <THead><tr><Th>Employee</Th><Th>Category</Th><Th>Vendor</Th><Th>Amount</Th><Th>Date</Th><Th>Receipt</Th><Th>Status</Th></tr></THead>
          <TBody>
            {filtered.map(e => {
              const emp = getEmployee(e.employeeId);
              return (
                <Tr key={e.id}>
                  <Td><div className="flex items-center gap-2">{emp && <Avatar name={fullName(emp)} size={24} />}<span className="text-sm font-medium text-ink-900">{emp ? fullName(emp) : '—'}</span></div></Td>
                  <Td><span className="text-xs font-medium px-2 py-0.5 rounded-md bg-ink-100 text-ink-700">{e.category}</span></Td>
                  <Td className="text-sm">{e.vendor}</Td>
                  <Td className="text-sm font-medium">{formatCurrency(e.amount)}</Td>
                  <Td className="text-sm text-ink-500">{formatDate(e.date)}</Td>
                  <Td>{e.receiptName ? <Button variant="ghost" size="xs" leftIcon={<Download className="h-3 w-3" />}>PDF</Button> : <span className="text-xs text-ink-400">Missing</span>}</Td>
                  <Td><StatusBadge status={e.status} /></Td>
                </Tr>
              );
            })}
          </TBody>
        </Table>
      </div>
    </div>
  );
}

export function BudgetsPage({ navigate }: RouteProps) {
  const budgets = departments.map((d, i) => ({ dept: d.name, color: d.color, allocated: 100000 + (i * 42371) % 800000, spent: 60000 + (i * 31371) % 600000 }));
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Finance', onClick: () => navigate('/finance/expenses') }, { label: 'Budgets' }]} />} title="Department Budgets" description="FY25 allocation vs spend" actions={<Button size="sm" variant="outline">Edit Budget</Button>} />
      <div className="p-6 space-y-3">
        {budgets.map(b => {
          const pct = (b.spent / b.allocated) * 100;
          return (
            <Card key={b.dept}>
              <CardBody>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: b.color }} />
                    <span className="text-sm font-medium text-ink-900">{b.dept}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-ink-500">{formatCurrency(b.spent)} of {formatCurrency(b.allocated)}</span>
                    <span className={['font-medium', pct > 90 ? 'text-red-600' : 'text-ink-900'].join(' ')}>{pct.toFixed(0)}%</span>
                  </div>
                </div>
                <ProgressBar value={pct} tone={pct > 90 ? 'red' : pct > 70 ? 'amber' : 'brand'} />
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ============ COMPLIANCE ============ */
export function CompliancePage({ navigate }: RouteProps) {
  const byType = (['paye','pension','nhf','nsitf','itf'] as const).map(t => {
    const items = complianceItems.filter(c => c.type === t);
    return { type: t, items, total: items.reduce((a, c) => a + c.amount, 0), overdue: items.filter(c => c.status === 'overdue').length };
  });
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Compliance' }]} />} title="Compliance Dashboard" description="PAYE, Pension, NHF, NSITF, ITF — Nigerian statutory compliance" />
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {byType.map(b => (
            <Card key={b.type}>
              <CardBody>
                <p className="text-xs uppercase tracking-wide text-ink-500 font-medium">{b.type}</p>
                <p className="text-lg font-semibold text-ink-900 mt-1">{formatCurrency(b.total)}</p>
                {b.overdue > 0 ? <p className="text-[11px] text-red-600 mt-1 font-medium">{b.overdue} overdue</p> : <p className="text-[11px] text-emerald-600 mt-1 font-medium">All filed</p>}
              </CardBody>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader title="All Filings" />
          <CardBody className="p-0">
            <Table>
              <THead><tr><Th>Type</Th><Th>Period</Th><Th>Amount</Th><Th>Due Date</Th><Th>Filed Date</Th><Th>Status</Th></tr></THead>
              <TBody>
                {complianceItems.map(c => (
                  <Tr key={c.id}>
                    <Td><span className="text-sm font-semibold uppercase text-ink-900">{c.type}</span></Td>
                    <Td className="text-sm">{c.period}</Td>
                    <Td className="text-sm font-medium">{formatCurrency(c.amount)}</Td>
                    <Td className="text-sm text-ink-500">{formatDate(c.dueDate)}</Td>
                    <Td className="text-sm text-ink-500">{c.filedDate ? formatDate(c.filedDate) : '—'}</Td>
                    <Td><StatusBadge status={c.status} /></Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

/* ============ ATTENDANCE ============ */
export function AttendancePage({ navigate }: RouteProps) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Attendance' }]} />} title="Clock In / Out" description={`Today is ${formatDate(today)}`} />
      <div className="p-6 space-y-4">
        <Card>
          <CardBody className="text-center py-10">
            <Clock time="09:14:32" />
            <p className="text-xs text-ink-500 mt-2">Local time • Lagos, NG</p>
            <div className="mt-6 flex justify-center gap-3">
              <Button size="lg" leftIcon={<Check className="h-4 w-4" />}>Clock In</Button>
              <Button size="lg" variant="outline" leftIcon={<X className="h-4 w-4" />}>Clock Out</Button>
            </div>
            <p className="text-[11px] text-ink-400 mt-4">Last clocked in: Today 08:42 AM</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Today's Team Attendance" subtitle={`${employees.length} employees`} />
          <CardBody className="p-0">
            <Table>
              <THead><tr><Th>Employee</Th><Th>Clock In</Th><Th>Clock Out</Th><Th>Status</Th><Th>Hours</Th></tr></THead>
              <TBody>
                {employees.slice(0, 15).map((e, i) => (
                  <Tr key={e.id} onClick={() => navigate(`/employees/${e.id}`)}>
                    <Td><div className="flex items-center gap-2"><Avatar name={fullName(e)} size={24} /><span className="text-sm font-medium text-ink-900">{fullName(e)}</span></div></Td>
                    <Td className="text-sm font-mono text-ink-700">{['08:42','09:01','08:55','09:03','08:30','09:14','—','08:48'][i%8]}</Td>
                    <Td className="text-sm font-mono text-ink-500">{i === 7 ? '—' : '—'}</Td>
                    <Td><StatusBadge status={i === 7 ? 'on_hold' : 'active'} label={i === 7 ? 'Pending' : 'Present'} /></Td>
                    <Td className="text-sm">{i === 7 ? '—' : '3h 28m'}</Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
function Clock({ time }: { time: string }) {
  return <p className="text-5xl font-bold text-ink-900 tracking-tight font-mono">{time}</p>;
}

export function TimesheetsPage({ navigate }: RouteProps) {
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Attendance', onClick: () => navigate('/attendance') }, { label: 'Timesheets' }]} />} title="Timesheets" description="Weekly time entries by employee" actions={<Button size="sm" variant="outline">Approve All</Button>} />
      <div className="bg-white">
        <Table>
          <THead><tr><Th>Employee</Th><Th>Mon</Th><Th>Tue</Th><Th>Wed</Th><Th>Thu</Th><Th>Fri</Th><Th>Total</Th><Th>Status</Th></tr></THead>
          <TBody>
            {employees.slice(0, 15).map((e, i) => {
              const hrs = [8, 7.5, 8, 8, 7, 6.5, 8, 8];
              const total = hrs.slice(0, 5).reduce((a, b) => a + b, 0);
              return (
                <Tr key={e.id}>
                  <Td><div className="flex items-center gap-2"><Avatar name={fullName(e)} size={24} /><span className="text-sm font-medium">{fullName(e)}</span></div></Td>
                  {hrs.slice(0,5).map((h, idx) => <Td key={idx} className="text-sm text-ink-700 font-mono">{h.toFixed(1)}</Td>)}
                  <Td className="text-sm font-semibold text-ink-900">{total.toFixed(1)}</Td>
                  <Td><StatusBadge status={i % 3 === 0 ? 'pending' : 'approved'} /></Td>
                </Tr>
              );
            })}
          </TBody>
        </Table>
      </div>
    </div>
  );
}

/* ============ REPORTS ============ */
export function EmployeeGrowthReportPage({ navigate }: RouteProps) {
  const monthly = [42, 47, 51, 55, 58, 60, 62, 65, 64, 68];
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Reports', onClick: () => navigate('/reports/growth') }, { label: 'Employee Growth' }]} />} title="Employee Growth" description="Headcount over the last 10 months" actions={<Button size="sm" variant="outline" leftIcon={<Download className="h-3.5 w-3.5" />}>Export</Button>} />
      <div className="p-6 space-y-4">
        <Card>
          <CardHeader title="Headcount Trend" subtitle="Total active employees per month" />
          <CardBody>
            <div className="flex items-end gap-3 h-64 px-2">
              {monthly.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <span className="text-[11px] text-ink-500 mb-1">{v}</span>
                  <div className="w-full bg-gradient-to-t from-brand-600 to-brand-400 rounded-t-md" style={{ height: `${(v / 70) * 100}%` }} />
                  <span className="text-[11px] text-ink-400 mt-2">{['Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May'][i]}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export function PayrollCostReportPage({ navigate }: RouteProps) {
  const months = payrollRuns.slice().reverse();
  const max = Math.max(...months.map(m => m.gross));
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Reports', onClick: () => navigate('/reports/payroll') }, { label: 'Payroll Cost' }]} />} title="Payroll Cost" description="Monthly gross, net, and deductions" actions={<Button size="sm" variant="outline" leftIcon={<Download className="h-3.5 w-3.5" />}>Export</Button>} />
      <div className="p-6 space-y-4">
        <Card>
          <CardHeader title="Monthly Payroll Cost" />
          <CardBody>
            <div className="space-y-3">
              {months.map(m => (
                <div key={m.id}>
                  <div className="flex justify-between text-xs mb-1"><span className="font-medium text-ink-700">{m.period}</span><span className="text-ink-500">{formatCurrency(m.gross)} gross • {formatCurrency(m.net)} net</span></div>
                  <div className="h-6 bg-ink-50 rounded-md overflow-hidden flex">
                    <div className="bg-brand-600" style={{ width: `${(m.net / m.gross) * (m.gross / max) * 100}%` }} />
                    <div className="bg-red-400" style={{ width: `${((m.gross - m.net) / m.gross) * (m.gross / max) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-brand-600" /> Net pay</span>
              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-red-400" /> Deductions (PAYE + Pension + NHF)</span>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

/* ============ WORKFLOWS ============ */
export function WorkflowsPage({ navigate }: RouteProps) {
  const workflows = [
    { id: 1, name: 'New Employee Onboarding', trigger: 'When employee is hired', actions: 7, status: 'active', runs: 14 },
    { id: 2, name: 'Probation Completion', trigger: 'When probation ends', actions: 3, status: 'active', runs: 5 },
    { id: 3, name: 'Leave Approval → Payroll', trigger: 'When leave is approved', actions: 2, status: 'active', runs: 38 },
    { id: 4, name: 'Asset Assignment Notification', trigger: 'When asset is assigned', actions: 2, status: 'paused', runs: 21 },
    { id: 5, name: 'Compliance Filing Reminder', trigger: 'Every 25th of month', actions: 1, status: 'active', runs: 6 },
  ];
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Workflow Automation' }]} />} title="Workflow Automation" description="Visual builder for automations" actions={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>New Workflow</Button>} />
      <div className="p-6 space-y-3">
        {workflows.map(w => (
          <Card key={w.id} className="hover:shadow-cardlg">
            <CardBody>
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase text-ink-400 px-2 py-1 bg-ink-100 rounded-md">IF</span>
                  <span className="text-sm text-ink-700">{w.trigger}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-ink-300" />
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono uppercase text-ink-400 px-2 py-1 bg-brand-100 rounded-md text-brand-700">THEN</span>
                  <span className="text-sm text-ink-700">{w.actions} actions</span>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <span className="text-xs text-ink-500">{w.runs} runs</span>
                  <StatusBadge status={w.status === 'active' ? 'active' : 'on_hold'} />
                  <Button variant="ghost" size="xs">Edit</Button>
                </div>
              </div>
              <p className="text-xs font-medium text-ink-900 mt-3">{w.name}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============ INTEGRATIONS ============ */
export function IntegrationsPage({ navigate }: RouteProps) {
  const integrations = [
    { name: 'Slack', category: 'Communication', connected: true, img: '💬' },
    { name: 'Google Workspace', category: 'Email & Docs', connected: true, img: '📧' },
    { name: 'Microsoft Teams', category: 'Communication', connected: false, img: '🎯' },
    { name: 'Paystack', category: 'Payments', connected: true, img: '💳' },
    { name: 'Monnify', category: 'Payments', connected: false, img: '🏦' },
    { name: 'QuickBooks', category: 'Accounting', connected: false, img: '📊' },
    { name: 'GitHub', category: 'Development', connected: true, img: '🐙' },
    { name: 'Figma', category: 'Design', connected: true, img: '🎨' },
    { name: 'Zoom', category: 'Video', connected: true, img: '🎥' },
    { name: 'DocuSign', category: 'Signatures', connected: false, img: '📝' },
  ];
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Integrations' }]} />} title="Integrations" description="Connect GuideOS with your favorite tools" />
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map(i => (
          <Card key={i.name} className="hover:shadow-cardlg">
            <CardBody className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-ink-100 flex items-center justify-center text-xl">{i.img}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink-900">{i.name}</p>
                <p className="text-[11px] text-ink-500">{i.category}</p>
                {i.connected ? <Badge tone="green" dot className="mt-2">Connected</Badge> : <Button size="xs" variant="outline" className="mt-2">Connect</Button>}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============ SETTINGS ============ */
export function SettingsPage({ navigate }: RouteProps) {
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Settings' }]} />} title="Company Settings" description="NerithonX Technologies (Pvt.) Ltd" />
      <div className="p-6">
        <Card>
          <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-ink-700 mb-1.5">Company Legal Name</label><Input defaultValue="NerithonX Technologies (Pvt.) Ltd" /></div>
            <div><label className="block text-xs font-medium text-ink-700 mb-1.5">Trading Name</label><Input defaultValue="NerithonX" /></div>
            <div><label className="block text-xs font-medium text-ink-700 mb-1.5">Tax ID</label><Input defaultValue="NG-12345678-0000" /></div>
            <div><label className="block text-xs font-medium text-ink-700 mb-1.5">Country</label><Input defaultValue="Nigeria" /></div>
            <div><label className="block text-xs font-medium text-ink-700 mb-1.5">Currency</label><Input defaultValue="USD" /></div>
            <div><label className="block text-xs font-medium text-ink-700 mb-1.5">Timezone</label><Input defaultValue="Africa/Lagos (WAT)" /></div>
            <div className="md:col-span-2"><label className="block text-xs font-medium text-ink-700 mb-1.5">Registered Address</label><Input defaultValue="10 Adeola Odeku Street, Victoria Island, Lagos, Nigeria" /></div>
          </CardBody>
        </Card>
        <div className="mt-4 flex justify-end"><Button size="md">Save Changes</Button></div>
      </div>
    </div>
  );
}

export function RolesPage({ navigate }: RouteProps) {
  const roles = [
    { name: 'Super Admin', users: 2, description: 'Full access to all modules, settings, and data.', scope: 'Everything' },
    { name: 'HR Admin', users: 4, description: 'Employee management, onboarding, payroll (view only).', scope: 'Employees + Onboarding' },
    { name: 'Finance Admin', users: 3, description: 'Payroll, expenses, compliance, budgets.', scope: 'Payroll + Finance + Compliance' },
    { name: 'Manager', users: 11, description: 'Approvals, team view, performance reviews.', scope: 'Team only' },
    { name: 'Employee', users: 47, description: 'Self-service portal: profile, payslips, leave.', scope: 'Self only' },
  ];
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Settings', onClick: () => navigate('/settings') }, { label: 'Roles & Permissions' }]} />} title="Roles & Permissions" description="5 system roles" actions={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>New Role</Button>} />
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map(r => (
          <Card key={r.name} className="hover:shadow-cardlg">
            <CardBody>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink-900">{r.name}</p>
                  <p className="text-xs text-ink-500 mt-1">{r.description}</p>
                </div>
                <Badge tone="ink">{r.users} users</Badge>
              </div>
              <div className="mt-3 pt-3 border-t border-ink-100 flex items-center justify-between">
                <span className="text-[11px] text-ink-500">Scope: {r.scope}</span>
                <Button variant="ghost" size="xs">Edit Permissions</Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
