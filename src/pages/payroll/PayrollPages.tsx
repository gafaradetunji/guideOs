import { useState } from 'react';
import { Plus, Download, DollarSign, ArrowRight, ChevronRight } from 'lucide-react';
import { PageHeader, Breadcrumbs, Card, CardHeader, CardBody, Button, Table, THead, Th, TBody, Tr, Td, Stat } from '../../components/ui';
import { StatusBadge, ProgressBar, Pagination } from '../../components/ui/Filters';
import { payrollRuns, employees, customers, formatCurrency, formatDate, fullName } from '../../data/seed';
import type { RouteProps } from '../../lib/types';

const PAGE_SIZE = 8;

export function PayrollRunsPage({ navigate }: RouteProps) {
  const totalGross = payrollRuns.reduce((a, p) => a + p.gross, 0);
  const totalNet = payrollRuns.reduce((a, p) => a + p.net, 0);
  const totalDeductions = payrollRuns.reduce((a, p) => a + p.deductions, 0);

  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Payroll', onClick: () => navigate('/payroll') }, { label: 'Payroll Runs' }]} />} title="Payroll Runs" description="Monthly payroll processing history" actions={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>New Run</Button>} />
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Total Gross (YTD)" value={formatCurrency(totalGross)} delta="+8% YoY" />
          <Stat label="Total Net (YTD)" value={formatCurrency(totalNet)} tone="green" />
          <Stat label="Total Deductions" value={formatCurrency(totalDeductions)} delta="18% of gross" tone="gray" />
          <Stat label="Avg Headcount" value="64" delta="+2 vs last" />
        </div>
        <Card>
          <CardHeader title="All Payroll Runs" action={<Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>Export</Button>} />
          <CardBody className="p-0">
            <Table>
              <THead><tr><Th>Period</Th><Th>Pay Date</Th><Th>Employees</Th><Th>Gross</Th><Th>Deductions</Th><Th>Net Pay</Th><Th>Status</Th><Th>Run By</Th></tr></THead>
              <TBody>
                {payrollRuns.map(p => (
                  <Tr key={p.id} className="cursor-pointer" onClick={() => navigate('/payroll/payslips')}>
                    <Td><div><p className="text-sm font-medium text-ink-900">{p.period}</p><p className="text-[11px] text-ink-500">Created {formatDate(p.createdAt)}</p></div></Td>
                    <Td className="text-sm text-ink-500">{formatDate(p.payDate)}</Td>
                    <Td className="text-sm">{p.employees}</Td>
                    <Td className="text-sm font-medium">{formatCurrency(p.gross)}</Td>
                    <Td className="text-sm text-red-600">-{formatCurrency(p.deductions)}</Td>
                    <Td className="text-sm font-semibold text-emerald-700">{formatCurrency(p.net)}</Td>
                    <Td><StatusBadge status={p.status} /></Td>
                    <Td className="text-sm text-ink-500">{p.runBy}</Td>
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

export function SalaryStructurePage({ navigate }: RouteProps) {
  const bands = [
    { level: 'L1 (Junior)', min: 40000, max: 60000, count: 8 },
    { level: 'L2 (Junior-Mid)', min: 55000, max: 75000, count: 12 },
    { level: 'L3 (Mid)', min: 70000, max: 95000, count: 16 },
    { level: 'L4 (Mid-Senior)', min: 90000, max: 125000, count: 14 },
    { level: 'L5 (Senior)', min: 120000, max: 160000, count: 9 },
    { level: 'L6 (Staff)', min: 150000, max: 200000, count: 5 },
    { level: 'L7 (Manager)', min: 180000, max: 240000, count: 3 },
    { level: 'L8 (Senior Manager+)', min: 220000, max: 350000, count: 1 },
  ];
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Payroll', onClick: () => navigate('/payroll') }, { label: 'Salary Structure' }]} />} title="Salary Structure" description="Salary bands by level" actions={<Button size="sm" variant="outline">Add Band</Button>} />
      <div className="p-6">
        <Card>
          <CardHeader title="Salary Bands" subtitle="Configure min/max ranges by level" />
          <CardBody className="p-0">
            <Table>
              <THead><tr><Th>Level</Th><Th>Min</Th><Th>Max</Th><Th>Range</Th><Th>Employees</Th><Th></Th></tr></THead>
              <TBody>
                {bands.map(b => (
                  <Tr key={b.level}>
                    <Td className="text-sm font-medium text-ink-900">{b.level}</Td>
                    <Td className="text-sm">{formatCurrency(b.min)}</Td>
                    <Td className="text-sm">{formatCurrency(b.max)}</Td>
                    <Td><div className="flex items-center gap-2"><ProgressBar value={50} /></div></Td>
                    <Td className="text-sm">{b.count}</Td>
                    <Td><Button variant="ghost" size="xs">Edit</Button></Td>
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

export function PayslipsPage({ navigate }: RouteProps) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(employees.length / PAGE_SIZE);
  const paged = employees.slice((page-1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Payroll', onClick: () => navigate('/payroll') }, { label: 'Payslips' }]} />} title="Payslips" description={`${employees.length} payslips for June 2025`} actions={<Button size="sm" variant="outline" leftIcon={<Download className="h-3.5 w-3.5" />}>Export All</Button>} />
      <div className="bg-white">
        <Table>
          <THead><tr><Th>Employee</Th><Th>Job Title</Th><Th>Gross</Th><Th>Deductions</Th><Th>Net Pay</Th><Th>Status</Th><Th></Th></tr></THead>
          <TBody>
            {paged.map(e => {
              const monthlyGross = e.salary / 12;
              const deductions = monthlyGross * 0.18;
              const net = monthlyGross - deductions;
              return (
                <Tr key={e.id}>
                  <Td><div className="flex items-center gap-2"><span className="text-sm font-medium text-ink-900">{fullName(e)}</span></div></Td>
                  <Td className="text-sm">{e.jobTitle}</Td>
                  <Td className="text-sm">{formatCurrency(monthlyGross)}</Td>
                  <Td className="text-sm text-red-600">-{formatCurrency(deductions)}</Td>
                  <Td className="text-sm font-semibold text-emerald-700">{formatCurrency(net)}</Td>
                  <Td><StatusBadge status="paid" /></Td>
                  <Td><Button variant="ghost" size="icon"><Download className="h-3.5 w-3.5" /></Button></Td>
                </Tr>
              );
            })}
          </TBody>
        </Table>
        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
      </div>
    </div>
  );
}

export function CustomerListPage({ navigate }: RouteProps) {
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Customers' }]} />} title="Customers" description="Active customer accounts" actions={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>Add Customer</Button>} />
      <div className="bg-white">
        <Table>
          <THead><tr><Th>Customer</Th><Th>Company</Th><Th>Plan</Th><Th>MRR</Th><Th>Status</Th><Th>Owner</Th><Th>Signup</Th></tr></THead>
          <TBody>
            {customers.map(c => (
              <Tr key={c.id}>
                <Td><div><p className="text-sm font-medium text-ink-900">{c.name}</p><p className="text-[11px] text-ink-500">{c.email}</p></div></Td>
                <Td className="text-sm">{c.company}</Td>
                <Td><span className="text-xs font-medium px-2 py-0.5 rounded-md bg-ink-100 text-ink-700 capitalize">{c.plan}</span></Td>
                <Td className="text-sm font-medium">{formatCurrency(c.mrr)}/mo</Td>
                <Td><StatusBadge status={c.status} /></Td>
                <Td className="text-sm">{c.owner}</Td>
                <Td className="text-sm text-ink-500">{formatDate(c.signupDate)}</Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}

export function ContractsPage({ navigate }: RouteProps) {
  const contracts = customers.slice(0, 12).map((c, i) => ({
    id: c.id, customer: c.company, plan: c.plan, mrr: c.mrr, term: ['12 mo','36 mo','24 mo','1 mo'][i%4], status: c.status === 'active' ? 'active' : c.status, startDate: c.signupDate, renewalDate: '2026-01-01',
  }));
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Customers', onClick: () => navigate('/customers') }, { label: 'Contracts' }]} />} title="Contracts" description={`${contracts.length} active customer contracts`} actions={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>New Contract</Button>} />
      <div className="bg-white">
        <Table>
          <THead><tr><Th>Customer</Th><Th>Plan</Th><Th>MRR</Th><Th>Term</Th><Th>Start</Th><Th>Renewal</Th><Th>Status</Th></tr></THead>
          <TBody>
            {contracts.map(c => (
              <Tr key={c.id}>
                <Td className="text-sm font-medium text-ink-900">{c.customer}</Td>
                <Td><span className="text-xs font-medium px-2 py-0.5 rounded-md bg-ink-100 text-ink-700 capitalize">{c.plan}</span></Td>
                <Td className="text-sm font-medium">{formatCurrency(c.mrr)}</Td>
                <Td className="text-sm">{c.term}</Td>
                <Td className="text-sm text-ink-500">{formatDate(c.startDate)}</Td>
                <Td className="text-sm text-ink-500">{formatDate(c.renewalDate)}</Td>
                <Td><StatusBadge status={c.status} /></Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}

export function InvoicesPage({ navigate }: RouteProps) {
  const invoices = customers.map((c, i) => ({
    id: `INV-${1000+i}`, customer: c.company, amount: c.mrr * 12, status: c.status === 'active' ? (i % 5 === 0 ? 'past_due' : 'paid') : 'paid', date: '2025-06-01', due: '2025-06-15',
  }));
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Customers', onClick: () => navigate('/customers') }, { label: 'Invoices' }]} />} title="Invoices" description={`${invoices.length} invoices`} actions={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>New Invoice</Button>} />
      <div className="bg-white">
        <Table>
          <THead><tr><Th>Invoice #</Th><Th>Customer</Th><Th>Amount</Th><Th>Date</Th><Th>Due</Th><Th>Status</Th><Th></Th></tr></THead>
          <TBody>
            {invoices.map(inv => (
              <Tr key={inv.id}>
                <Td className="text-sm font-mono text-ink-900">{inv.id}</Td>
                <Td className="text-sm">{inv.customer}</Td>
                <Td className="text-sm font-medium">{formatCurrency(inv.amount)}</Td>
                <Td className="text-sm text-ink-500">{formatDate(inv.date)}</Td>
                <Td className="text-sm text-ink-500">{formatDate(inv.due)}</Td>
                <Td><StatusBadge status={inv.status} /></Td>
                <Td><Button variant="ghost" size="xs">View</Button></Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>
    </div>
  );
}
