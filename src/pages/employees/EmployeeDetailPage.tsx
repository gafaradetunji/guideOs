import { useState } from 'react';
import {
  User, Briefcase, Laptop, FileText, FileBarChart, Mail, Phone, MapPin, Star,
  Download, CheckCircle2, Clock, AlertCircle,
} from 'lucide-react';
import { PageHeader, Breadcrumbs, Tabs, Card, CardHeader, CardBody, Avatar, Badge, Button } from '../../components/ui';
import { StatusBadge, ProgressBar } from '../../components/ui/Filters';
import { Drawer } from '../../components/ui/Overlays';
import {
  teams, payrollRuns,
  formatCurrency, formatDate, fullName, getDepartment, relativeTime, type Employee,
} from '../../data/seed';
import { useMockData } from '../../mock/MockDataProvider';
import type { RouteProps } from '../../lib/types';

export function EmployeeDetailPage({ path, navigate }: RouteProps) {
  const { employees } = useMockData();
  const id = path.split('/').filter(Boolean)[1];
  const employee = employees.find(e => e.id === id) || employees[1];
  const dept = getDepartment(employee.departmentId);
  const manager = employee.managerId ? employees.find(e => e.id === employee.managerId) : undefined;
  const [tab, setTab] = useState('overview');
  const [leaveDrawerOpen, setLeaveDrawerOpen] = useState(false);

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'personal', label: 'Personal Information' },
    { key: 'employment', label: 'Employment' },
    { key: 'payroll', label: 'Payroll' },
    { key: 'benefits', label: 'Benefits' },
    { key: 'leave', label: 'Leave' },
    { key: 'assets', label: 'Assets' },
    { key: 'documents', label: 'Documents' },
    { key: 'permissions', label: 'Permissions' },
    { key: 'performance', label: 'Performance' },
    { key: 'activity', label: 'Activity Log' },
    { key: 'notes', label: 'Notes' },
  ];

  return (
    <div>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[
          { label: 'Employees', onClick: () => navigate('/employees') },
          { label: fullName(employee) },
        ]} />}
        title={
          <div className="flex items-center gap-3">
            <Avatar name={fullName(employee)} size={40} />
            <div>
              <div className="flex items-center gap-2">
                <span>{fullName(employee)}</span>
                <StatusBadge status={employee.status} />
              </div>
              <p className="text-xs text-ink-500 font-normal mt-0.5">{employee.jobTitle} • {dept?.name}</p>
            </div>
          </div>
        }
        actions={
          <>
            <Button variant="outline" size="sm" leftIcon={<Mail className="h-3.5 w-3.5" />} onClick={() => setLeaveDrawerOpen(true)}>Message</Button>
            <Button size="sm" leftIcon={<FileBarChart className="h-3.5 w-3.5" />}>Edit Profile</Button>
          </>
        }
      />

      {/* Tabs */}
      <div className="px-6 bg-white border-b border-ink-200 sticky top-0 z-10">
        <Tabs items={tabs} active={tab} onChange={setTab} />
      </div>

      <div className="p-6">
        {tab === 'overview' && <OverviewTab employee={employee} dept={dept} manager={manager} navigate={navigate} />}
        {tab === 'personal' && <PersonalTab employee={employee} />}
        {tab === 'employment' && <EmploymentTab employee={employee} dept={dept} />}
        {tab === 'payroll' && <PayrollTab employee={employee} navigate={navigate} />}
        {tab === 'benefits' && <BenefitsTab />}
        {tab === 'leave' && <LeaveTab employee={employee} onRequest={() => setLeaveDrawerOpen(true)} />}
        {tab === 'assets' && <AssetsTab employee={employee} />}
        {tab === 'documents' && <DocumentsTab employee={employee} />}
        {tab === 'permissions' && <PermissionsTab />}
        {tab === 'performance' && <PerformanceTab />}
        {tab === 'activity' && <ActivityTab employee={employee} />}
        {tab === 'notes' && <NotesTab />}
      </div>

      <Drawer open={leaveDrawerOpen} onClose={() => setLeaveDrawerOpen(false)} title={`Message ${employee.firstName}`} description="Send a direct message via GuideOS">
        <div className="p-6 space-y-4">
          <textarea placeholder={`Write a message to ${employee.firstName}...`} className="w-full h-32 rounded-lg border border-ink-200 p-3 text-sm focus-ring resize-none" />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setLeaveDrawerOpen(false)}>Cancel</Button>
            <Button size="sm" onClick={() => setLeaveDrawerOpen(false)}>Send</Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

function OverviewTab({ employee, dept, manager, navigate }: { employee: Employee; dept?: any; manager?: Employee; navigate: (to: string) => void }) {
  const { assets, leaveRequests } = useMockData();
  const empAssets = assets.filter(a => a.assigneeId === employee.id);
  const empLeave = leaveRequests.filter(l => l.employeeId === employee.id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="space-y-4">
        <Card>
          <CardHeader title="At a Glance" />
          <CardBody>
            <dl className="space-y-3 text-sm">
              <Row icon={<Briefcase className="h-3.5 w-3.5" />} label="Job Title" value={employee.jobTitle} />
              <Row icon={<User className="h-3.5 w-3.5" />} label="Department" value={dept?.name} onClick={() => navigate('/employees/departments')} />
              <Row icon={<Star className="h-3.5 w-3.5" />} label="Level" value={employee.level} />
              <Row icon={<User className="h-3.5 w-3.5" />} label="Manager" value={manager ? fullName(manager) : '—'} />
              <Row icon={<MapPin className="h-3.5 w-3.5" />} label="Location" value={`${employee.location}, ${employee.country}`} />
              <Row icon={<Clock className="h-3.5 w-3.5" />} label="Start Date" value={formatDate(employee.startDate)} />
              <Row icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={employee.email} />
              <Row icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={employee.phone} />
            </dl>
            {employee.onboardingProgress !== undefined && employee.onboardingProgress < 100 && (
              <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-100">
                <p className="text-xs font-medium text-amber-800">Onboarding in progress</p>
                <div className="mt-2"><ProgressBar value={employee.onboardingProgress} tone="amber" /></div>
                <p className="text-[11px] text-amber-600 mt-1">{employee.onboardingProgress}% complete</p>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Teams" />
          <CardBody>
            <div className="flex flex-wrap gap-1.5">
              {employee.teamIds.map(tid => {
                const t = teams.find(x => x.id === tid);
                return t ? <Badge key={tid} tone="blue">{t.name}</Badge> : null;
              })}
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <MiniStat label="Annual Salary" value={formatCurrency(employee.salary)} />
          <MiniStat label="Assigned Assets" value={String(empAssets.length)} />
          <MiniStat label="Leave taken" value="6 days" />
        </div>

        <Card>
          <CardHeader title="Assigned Assets" action={<Button variant="ghost" size="xs" onClick={() => navigate('/assets/assigned')}>View all</Button>} />
          <CardBody className="p-0">
            {empAssets.length === 0 ? (
              <p className="text-sm text-ink-500 px-5 py-6 text-center">No assets currently assigned.</p>
            ) : (
              <div className="divide-y divide-ink-100">
                {empAssets.map(a => (
                  <div key={a.id} className="px-5 py-3 flex items-center gap-3">
                    <span className="h-8 w-8 rounded-lg bg-ink-100 text-ink-600 flex items-center justify-center"><Laptop className="h-4 w-4" /></span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink-900">{a.name}</p>
                      <p className="text-[11px] text-ink-500">{a.brand} • {a.serial}</p>
                    </div>
                    <StatusBadge status={a.status} label={a.status} />
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Recent Leave" />
          <CardBody className="p-0">
            <div className="divide-y divide-ink-100">
              {empLeave.slice(0, 3).map(l => (
                <div key={l.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium capitalize text-ink-900">{l.type} Leave</p>
                    <p className="text-[11px] text-ink-500">{formatDate(l.startDate)} → {formatDate(l.endDate)} • {l.days} days</p>
                  </div>
                  <StatusBadge status={l.status} />
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function PersonalTab({ employee }: { employee: Employee }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader title="Basic Information" />
        <CardBody>
          <Field label="First Name" value={employee.firstName} />
          <Field label="Last Name" value={employee.lastName} />
          <Field label="Pronouns" value={employee.pronouns || '—'} />
          <Field label="Birth Date" value={employee.birthDate ? formatDate(employee.birthDate) : '—'} />
          <Field label="Personal Email" value={employee.email} />
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Contact & Address" />
        <CardBody>
          <Field label="Phone" value={employee.phone} />
          <Field label="Work Email" value={employee.email} />
          <Field label="Location" value={employee.location} />
          <Field label="Country" value={employee.country} />
          <Field label="Residential Address" value={employee.address || '—'} />
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Emergency Contact" />
        <CardBody>
          <Field label="Name" value={employee.emergencyContact?.name || '—'} />
          <Field label="Phone" value={employee.emergencyContact?.phone || '—'} />
          <Field label="Relationship" value={employee.emergencyContact?.relationship || '—'} />
        </CardBody>
      </Card>
    </div>
  );
}

function EmploymentTab({ employee, dept }: { employee: Employee; dept?: any }) {
  const { employees } = useMockData();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader title="Employment Details" />
        <CardBody>
          <Field label="Job Title" value={employee.jobTitle} />
          <Field label="Employment Type" value={employee.employmentType.replace('_', ' ')} />
          <Field label="Department" value={dept?.name} />
          <Field label="Level" value={employee.level} />
          <Field label="Status" value={<StatusBadge status={employee.status} />} />
          <Field label="Start Date" value={formatDate(employee.startDate)} />
          {employee.endDate && <Field label="End Date" value={formatDate(employee.endDate)} />}
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Teams & Org" />
        <CardBody>
          <Field label="Manager" value={employee.managerId ? fullName(employees.find(e => e.id === employee.managerId)!) : 'CEO'} />
          <Field label="Department Lead" value={dept?.leadId ? fullName(employees.find(e => e.id === dept.leadId)!) : '—'} />
          <div>
            <p className="text-xs text-ink-500 mb-1.5">Teams</p>
            <div className="flex flex-wrap gap-1.5">
              {employee.teamIds.map(tid => {
                const t = teams.find(x => x.id === tid);
                return t ? <Badge key={tid} tone="blue">{t.name}</Badge> : null;
              })}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function PayrollTab({ employee, navigate }: { employee: Employee; navigate: (to: string) => void }) {
  const annualGross = employee.salary;
  const monthlyGross = annualGross / 12;
  const paye = monthlyGross * 0.17;
  const pension = monthlyGross * 0.08;
  const nhf = monthlyGross * 0.025;
  const net = monthlyGross - paye - pension - nhf;
  const deductions = paye + pension + nhf;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MiniStat label="Annual Gross" value={formatCurrency(annualGross)} />
        <MiniStat label="Monthly Gross" value={formatCurrency(monthlyGross)} />
        <MiniStat label="Monthly Net" value={formatCurrency(net)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader title="Salary Breakdown (Monthly)" />
          <CardBody>
            <div className="space-y-2.5 text-sm">
              <Line label="Basic Salary" value={formatCurrency(monthlyGross)} />
              <Line label="Housing Allowance" value={formatCurrency(monthlyGross * 0.1)} muted />
              <Line label="Transport Allowance" value={formatCurrency(monthlyGross * 0.05)} muted />
              <Line label="Total Gross" value={formatCurrency(monthlyGross)} bold />
              <div className="border-t border-ink-100 my-2" />
              <Line label="PAYE (Tax)" value={`-${formatCurrency(paye)}`} tone="red" />
              <Line label="Pension (8%)" value={`-${formatCurrency(pension)}`} tone="red" />
              <Line label="NHF (2.5%)" value={`-${formatCurrency(nhf)}`} tone="red" />
              <div className="border-t border-ink-100 my-2" />
              <Line label="Total Deductions" value={`-${formatCurrency(deductions)}`} muted />
              <Line label="Net Pay" value={formatCurrency(net)} bold tone="green" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Bank & Payout" />
          <CardBody>
            <Field label="Bank Name" value={employee.bankName || '—'} />
            <Field label="Account Number" value={employee.accountNumber || '—'} />
            <Field label="Currency" value={employee.currency} />
            <Field label="Payment Frequency" value="Monthly" />
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Recent Payslips" action={<Button variant="ghost" size="xs" onClick={() => navigate('/payroll/payslips')}>All payslips</Button>} />
        <CardBody className="p-0">
          <div className="divide-y divide-ink-100">
            {payrollRuns.slice(0, 5).map(p => (
              <div key={p.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ink-900">{p.period} Payslip</p>
                  <p className="text-[11px] text-ink-500">Paid on {formatDate(p.payDate)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-ink-900">{formatCurrency(net)}</span>
                  <StatusBadge status={p.status} />
                  <Button variant="ghost" size="icon"><Download className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function BenefitsTab() {
  const benefits = [
    { name: 'Health Insurance (Family)', provider: 'AXA Mansard', status: 'active', value: '$8,400/yr' },
    { name: 'Life Insurance', provider: 'AIICO', status: 'active', value: '$50,000' },
    { name: 'Pension Plan', provider: 'Stanbic IBTC', status: 'active', value: '8% + 10% match' },
    { name: 'Annual Leave', provider: 'GuideOS', status: 'active', value: '21 days' },
    { name: 'Sick Leave', provider: 'GuideOS', status: 'active', value: '10 days' },
    { name: 'Gym Stipend', provider: 'ClassPass', status: 'active', value: '$50/mo' },
    { name: 'Learning Budget', provider: 'Udemy', status: 'pending', value: '$1,200/yr' },
  ];
  return (
    <Card>
      <CardHeader title="Benefits Enrollment" action={<Button size="sm" variant="outline">Manage Benefits</Button>} />
      <CardBody className="p-0">
        <div className="divide-y divide-ink-100">
          {benefits.map(b => (
            <div key={b.name} className="px-5 py-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-ink-900">{b.name}</p>
                <p className="text-[11px] text-ink-500">{b.provider} • {b.value}</p>
              </div>
              <StatusBadge status={b.status} />
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function LeaveTab({ employee, onRequest }: { employee: Employee; onRequest: () => void }) {
  const { leaveRequests } = useMockData();
  const empLeave = leaveRequests.filter(l => l.employeeId === employee.id);
  const balance = [
    { type: 'Annual Leave', used: 6, total: 21, tone: 'brand' as const },
    { type: 'Sick Leave', used: 2, total: 10, tone: 'amber' as const },
    { type: 'Compassionate', used: 0, total: 5, tone: 'green' as const },
    { type: 'Unpaid Leave', used: 0, total: 30, tone: 'brand' as const },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {balance.map(b => (
          <Card key={b.type}>
            <CardBody>
              <p className="text-xs text-ink-500">{b.type}</p>
              <p className="text-xl font-semibold text-ink-900 mt-1">{b.total - b.used}<span className="text-sm text-ink-400 font-normal"> / {b.total} days</span></p>
              <div className="mt-2"><ProgressBar value={(b.used / b.total) * 100} tone={b.tone} /></div>
              <p className="text-[11px] text-ink-400 mt-1">{b.used} used</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Leave History" action={<Button size="sm" onClick={onRequest}>Request Leave</Button>} />
        <CardBody className="p-0">
          <div className="divide-y divide-ink-100">
            {empLeave.length === 0 ? (
              <p className="text-sm text-ink-500 px-5 py-6 text-center">No leave requests yet.</p>
            ) : empLeave.map(l => (
              <div key={l.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium capitalize text-ink-900">{l.type} Leave • {l.days} days</p>
                  <p className="text-[11px] text-ink-500">{formatDate(l.startDate)} → {formatDate(l.endDate)}</p>
                </div>
                <StatusBadge status={l.status} />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function AssetsTab({ employee }: { employee: Employee }) {
  const { assets } = useMockData();
  const empAssets = assets.filter(a => a.assigneeId === employee.id);
  return (
    <Card>
      <CardHeader title="Assigned Assets" action={<Button size="sm" variant="outline">Assign Asset</Button>} />
      <CardBody className="p-0">
        {empAssets.length === 0 ? (
          <p className="text-sm text-ink-500 px-5 py-8 text-center">No assets currently assigned to this employee.</p>
        ) : (
          <div className="divide-y divide-ink-100">
            {empAssets.map(a => (
              <div key={a.id} className="px-5 py-3 flex items-center justify-between gap-3 hover:bg-ink-50/50">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="h-9 w-9 rounded-lg bg-ink-100 text-ink-600 flex items-center justify-center flex-shrink-0"><Laptop className="h-4 w-4" /></span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-900 truncate">{a.name}</p>
                    <p className="text-[11px] text-ink-500 capitalize">{a.type} • {a.brand} • {a.serial}</p>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={a.status} />
                  <p className="text-[11px] text-ink-400 mt-0.5">Since {a.assignedAt ? formatDate(a.assignedAt) : '—'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function DocumentsTab({ employee }: { employee: Employee }) {
  const docs = [
    { name: 'Employment Contract.pdf', size: '284 KB', date: employee.startDate, type: 'Contract' },
    { name: 'Offer Letter - Signed.pdf', size: '156 KB', date: employee.startDate, type: 'Offer' },
    { name: 'PAYE Form.pdf', size: '92 KB', date: employee.startDate, type: 'Tax' },
    { name: 'Pension Enrollment.pdf', size: '78 KB', date: employee.startDate, type: 'Pension' },
    { name: 'ID Document.pdf', size: '512 KB', date: employee.startDate, type: 'Identity' },
    { name: 'ND Agreement.pdf', size: '144 KB', date: employee.startDate, type: 'Legal' },
  ];
  return (
    <Card>
      <CardHeader title="Documents" action={<Button size="sm" variant="outline" leftIcon={<FileText className="h-3.5 w-3.5" />}>Upload</Button>} />
      <CardBody className="p-0">
        <div className="divide-y divide-ink-100">
          {docs.map(d => (
            <div key={d.name} className="px-5 py-3 flex items-center gap-3 hover:bg-ink-50/50">
              <span className="h-9 w-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center"><FileText className="h-4 w-4" /></span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink-900 truncate">{d.name}</p>
                <p className="text-[11px] text-ink-500">{d.type} • {d.size} • {formatDate(d.date)}</p>
              </div>
              <Button variant="ghost" size="icon"><Download className="h-3.5 w-3.5" /></Button>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function PermissionsTab() {
  const roles = ['Super Admin', 'HR Admin', 'Finance', 'Manager', 'Employee'];
  const permissions = [
    { module: 'Employees', actions: ['View', 'Create', 'Edit', 'Deactivate'], granted: [true, true, true, false] },
    { module: 'Payroll', actions: ['View', 'Run', 'Approve', 'Export'], granted: [true, false, false, false] },
    { module: 'CRM', actions: ['View', 'Create', 'Edit', 'Delete'], granted: [true, true, false, false] },
    { module: 'Finance', actions: ['View', 'Approve', 'Export'], granted: [true, false, false] },
    { module: 'Settings', actions: ['View','Edit Roles'], granted: [false, false] },
  ];
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader title="Assigned Role" />
        <CardBody>
          <div className="flex flex-wrap gap-2">
            {roles.map(r => (
              <button key={r} className={['px-3 py-1.5 rounded-lg text-xs font-medium border', r === 'HR Admin' ? 'bg-brand-50 border-brand-200 text-brand-700' : 'bg-white border-ink-200 text-ink-600 hover:bg-ink-50'].join(' ')}>{r}</button>
            ))}
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Effective Permissions" />
        <CardBody className="p-0">
          <div className="divide-y divide-ink-100">
            {permissions.map(p => (
              <div key={p.module} className="px-5 py-3">
                <p className="text-sm font-medium text-ink-900 mb-2">{p.module}</p>
                <div className="flex flex-wrap gap-2">
                  {p.actions.map((a, i) => (
                    <span key={a} className={['inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium', p.granted[i] ? 'bg-emerald-50 text-emerald-700' : 'bg-ink-100 text-ink-400'].join(' ')}>
                      {p.granted[i] ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />} {a}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function PerformanceTab() {
  const reviews = [
    { cycle: 'H1 2025', rating: 4.2, status: 'completed', reviewer: 'Sade Adewale' },
    { cycle: 'H2 2024', rating: 4.0, status: 'completed', reviewer: 'Sade Adewale' },
    { cycle: 'H1 2024', rating: 3.8, status: 'completed', reviewer: 'Bisi Ogun' },
  ];
  const goals = [
    { title: 'Ship onboarding redesign', progress: 80, due: 'Q3 2025' },
    { title: 'Complete Stripe certification', progress: 100, due: 'Q2 2025' },
    { title: 'Mentor 2 junior engineers', progress: 45, due: 'Q4 2025' },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader title="Performance Reviews" />
        <CardBody className="p-0">
          <div className="divide-y divide-ink-100">
            {reviews.map(r => (
              <div key={r.cycle} className="px-5 py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink-900">{r.cycle}</p>
                    <p className="text-[11px] text-ink-500">Reviewed by {r.reviewer}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-brand-600">{r.rating}/5</span>
                    <StatusBadge status="done" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="Goals & Objectives" action={<Button size="sm" variant="outline">Add Goal</Button>} />
        <CardBody className="p-0">
          <div className="divide-y divide-ink-100">
            {goals.map(g => (
              <div key={g.title} className="px-5 py-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-ink-900">{g.title}</p>
                  <StatusBadge status={g.progress === 100 ? 'done' : 'in_progress'} />
                </div>
                <ProgressBar value={g.progress} tone={g.progress === 100 ? 'green' : 'brand'} />
                <p className="text-[11px] text-ink-500 mt-1">{g.progress}% • Due {g.due}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function ActivityTab({ employee }: { employee: Employee }) {
  const logs = [
    { action: 'Profile updated', by: 'Fatima Ibrahim', time: '2025-06-18T14:30:00Z' },
    { action: 'Salary increased to ' + formatCurrency(employee.salary), by: 'HR Admin', time: '2025-04-01T10:00:00Z' },
    { action: 'Leave approved (5 days)', by: 'Sade Adewale', time: '2025-03-15T09:30:00Z' },
    { action: 'Asset assigned: MacBook Pro 14"', by: 'IT Admin', time: '2025-01-20T11:00:00Z' },
    { action: 'Onboarding completed', by: 'System', time: employee.startDate + 'T08:00:00Z' },
    { action: 'Account created', by: 'System', time: employee.startDate + 'T08:00:00Z' },
  ];
  return (
    <Card>
      <CardHeader title="Activity Log" />
      <CardBody className="p-0">
        <div className="divide-y divide-ink-100">
          {logs.map((l, i) => (
            <div key={i} className="px-5 py-3 flex items-start gap-3">
              <span className="h-2 w-2 rounded-full bg-brand-500 mt-1.5" />
              <div className="flex-1">
                <p className="text-sm text-ink-900">{l.action}</p>
                <p className="text-[11px] text-ink-400">{l.by} • {relativeTime(l.time)}</p>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function NotesTab() {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([
    { author: 'Fatima Ibrahim', text: 'Strong contributor. Recently led onboarding redesign project successfully.', time: '2 days ago' },
    { author: 'Sade Adewale', text: 'Mentoring two junior engineers. Great leadership growth this quarter.', time: '1 week ago' },
  ]);
  return (
    <Card>
      <CardHeader title="Private Notes" subtitle="Visible to HR admins only" />
      <CardBody>
        <div className="mb-4">
          <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add a private note..." className="w-full h-24 rounded-lg border border-ink-200 p-3 text-sm focus-ring resize-none" />
          <div className="mt-2 flex justify-end">
            <Button size="sm" onClick={() => { if (!note.trim()) return; setNotes([...notes, { author: 'You', text: note, time: 'just now' }]); setNote(''); }}>Add Note</Button>
          </div>
        </div>
        <div className="space-y-3">
          {notes.map((n, i) => (
            <div key={i} className="p-3 rounded-lg bg-ink-50 border border-ink-100">
              <div className="flex items-center gap-2 mb-1">
                <Avatar name={n.author} size={24} />
                <span className="text-xs font-medium text-ink-900">{n.author}</span>
                <span className="text-[11px] text-ink-400">• {n.time}</span>
              </div>
              <p className="text-sm text-ink-700">{n.text}</p>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

function Row({ icon, label, value, onClick }: { icon: React.ReactNode; label: string; value: React.ReactNode; onClick?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="flex items-center gap-2 text-xs text-ink-500">
        <span className="text-ink-400">{icon}</span> {label}
      </dt>
      <dd className={['text-sm text-ink-900 font-medium text-right', onClick ? 'hover:text-brand-600 cursor-pointer' : ''].join(' ')} onClick={onClick}>{value}</dd>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="py-2.5 border-b border-ink-100 last:border-0">
      <p className="text-xs text-ink-500 mb-1">{label}</p>
      <p className="text-sm text-ink-900">{value}</p>
    </div>
  );
}

function Line({ label, value, bold, muted, tone }: { label: string; value: string; bold?: boolean; muted?: boolean; tone?: 'red' | 'green' }) {
  const toneClass = tone === 'red' ? 'text-red-600' : tone === 'green' ? 'text-emerald-600' : 'text-ink-900';
  return (
    <div className="flex items-center justify-between">
      <span className={['text-ink-600', bold ? 'font-semibold text-ink-900' : ''].join(' ')}>{label}</span>
      <span className={[bold ? 'font-semibold' : '', muted ? 'text-ink-500' : toneClass].join(' ')}>{value}</span>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardBody>
        <p className="text-xs text-ink-500 uppercase tracking-wide">{label}</p>
        <p className="text-xl font-semibold text-ink-900 mt-1">{value}</p>
      </CardBody>
    </Card>
  );
}
