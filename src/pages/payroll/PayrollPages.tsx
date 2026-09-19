import { useMemo, useState, type ReactNode } from 'react';
import {
  Plus, Download, ArrowLeft, Check, CheckCircle2, Play, Trash2, Users, Wallet,
  ShieldCheck, FileText, ChevronRight, AlertTriangle,
} from 'lucide-react';
import {
  PageHeader, Breadcrumbs, Card, CardHeader, CardBody, Button, Table, THead, Th, TBody, Tr, Td,
  Stat, Input, Drawer, Modal, EmptyState, Badge, Avatar,
} from '../../components/ui';
import { StatusBadge, ProgressBar, Pagination, FilterSelect } from '../../components/ui/Filters';
import {
  customers, formatCurrency, formatDate, buildPayslip, summarisePayslips,
  payrollEligibleEmployees, statutorySchemesApply,
  type PayrollRun, type Payslip,
} from '../../data/seed';
import { computePayroll, PAYE_BANDS } from '../../lib/tax';
import { useMockData } from '../../mock/MockDataProvider';
import type { RouteProps } from '../../lib/types';

const PAGE_SIZE = 10;

const monthLabel = (iso: string) =>
  new Date(iso).toLocaleDateString('en-NG', { month: 'long', year: 'numeric' });

// ------------------------------------------------------------- runs listing

export function PayrollRunsPage({ navigate }: RouteProps) {
  const { payrollRuns, approvePayrollRun, processPayrollRun, markPayrollRunPaid, deletePayrollRun } = useMockData();
  const [wizardOpen, setWizardOpen] = useState(false);

  const paidRuns = payrollRuns.filter(r => r.status === 'paid');
  const ytdGross = paidRuns.reduce((a, p) => a + p.gross, 0);
  const ytdNet = paidRuns.reduce((a, p) => a + p.net, 0);
  const ytdPaye = paidRuns.reduce((a, p) => a + p.paye, 0);
  const pending = payrollRuns.filter(r => r.status === 'draft' || r.status === 'approved' || r.status === 'processing');

  return (
    <div>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: 'Payroll', onClick: () => navigate('/payroll') }, { label: 'Payroll Runs' }]} />}
        title="Payroll Runs"
        description="Create, approve and disburse monthly payroll with statutory PAYE, pension and NHF."
        actions={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />} onClick={() => setWizardOpen(true)}>New Run</Button>}
      />
      <div className="p-4 sm:p-6 space-y-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Gross Paid (YTD)" value={formatCurrency(ytdGross)} delta={`${paidRuns.length} completed runs`} tone="gray" />
          <Stat label="Net Disbursed (YTD)" value={formatCurrency(ytdNet)} tone="green" />
          <Stat label="PAYE Remitted (YTD)" value={formatCurrency(ytdPaye)} delta="Payable to state IRS" tone="gray" />
          <Stat label="Pending Runs" value={String(pending.length)} delta={pending.length ? 'Action required' : 'All clear'} tone={pending.length ? 'red' : 'green'} />
        </div>

        <Card>
          <CardHeader title="All Payroll Runs" subtitle={`${payrollRuns.length} runs`}
            action={<Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>Export</Button>} />
          <CardBody className="p-0">
            {payrollRuns.length === 0 ? (
              <EmptyState icon={<Wallet className="h-5 w-5" />} title="No payroll runs yet"
                description="Create your first run to calculate PAYE, pension and NHF for your team."
                action={<Button size="sm" onClick={() => setWizardOpen(true)}>New Run</Button>} />
            ) : (
              <Table>
                <THead><tr><Th>Period</Th><Th>Pay Date</Th><Th>Staff</Th><Th>Gross</Th><Th>Deductions</Th><Th>Net Pay</Th><Th>Status</Th><Th /></tr></THead>
                <TBody>
                  {payrollRuns.map(run => (
                    <Tr key={run.id} onClick={() => navigate(`/payroll/runs/${run.id}`)}>
                      <Td>
                        <div>
                          <p className="text-sm font-medium text-ink-900">{run.period}</p>
                          <p className="text-[11px] text-ink-500">Created {formatDate(run.createdAt)} by {run.runBy}</p>
                        </div>
                      </Td>
                      <Td className="text-sm text-ink-500">{formatDate(run.payDate)}</Td>
                      <Td className="text-sm">{run.employees}</Td>
                      <Td className="text-sm font-medium">{formatCurrency(run.gross)}</Td>
                      <Td className="text-sm text-red-600">-{formatCurrency(run.deductions)}</Td>
                      <Td className="text-sm font-semibold text-emerald-700">{formatCurrency(run.net)}</Td>
                      <Td><StatusBadge status={run.status} /></Td>
                      <Td>
                        <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                          {run.status === 'draft' && (
                            <>
                              <Button variant="ghost" size="xs" leftIcon={<Check className="h-3 w-3" />} onClick={() => approvePayrollRun(run.id)}>Approve</Button>
                              <Button variant="ghost" size="icon" aria-label="Discard draft run" onClick={() => deletePayrollRun(run.id)}>
                                <Trash2 className="h-3.5 w-3.5 text-red-600" />
                              </Button>
                            </>
                          )}
                          {run.status === 'approved' && (
                            <Button variant="ghost" size="xs" leftIcon={<Play className="h-3 w-3" />} onClick={() => processPayrollRun(run.id)}>Process</Button>
                          )}
                          {run.status === 'processing' && (
                            <Button variant="ghost" size="xs" leftIcon={<CheckCircle2 className="h-3 w-3" />} onClick={() => markPayrollRunPaid(run.id)}>Mark Paid</Button>
                          )}
                          <Button variant="ghost" size="xs" onClick={() => navigate(`/payroll/runs/${run.id}`)}>View</Button>
                        </div>
                      </Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>
            )}
          </CardBody>
        </Card>
      </div>

      <PayrollWizard open={wizardOpen} onClose={() => setWizardOpen(false)} navigate={navigate} />
    </div>
  );
}

// ------------------------------------------------------------- run creation

const wizardSteps = [
  { id: 1, label: 'Period', icon: <FileText className="h-4 w-4" /> },
  { id: 2, label: 'Employees', icon: <Users className="h-4 w-4" /> },
  { id: 3, label: 'Adjustments', icon: <Wallet className="h-4 w-4" /> },
  { id: 4, label: 'Review', icon: <ShieldCheck className="h-4 w-4" /> },
];

function PayrollWizard({ open, onClose, navigate }: { open: boolean; onClose: () => void; navigate: (to: string) => void }) {
  const { employees, payrollRuns, createPayrollRun } = useMockData();
  const [step, setStep] = useState(1);

  const defaultPeriod = new Date().toISOString().slice(0, 7);
  const [period, setPeriod] = useState(defaultPeriod);
  const [payDate, setPayDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 28).toISOString().slice(0, 10);
  });
  const [note, setNote] = useState('');
  const eligible = useMemo(() => payrollEligibleEmployees(employees), [employees]);
  const [selected, setSelected] = useState<string[]>(() => eligible.map(e => e.id));
  const [adjustments, setAdjustments] = useState<Record<string, { bonus?: number; otherDeductions?: number }>>({});
  const [search, setSearch] = useState('');

  // Re-seed the roster whenever the drawer is reopened (headcount may have changed).
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setStep(1);
      setSelected(eligible.map(e => e.id));
      setAdjustments({});
      setSearch('');
      setNote('');
    }
  }

  const periodStart = `${period}-01`;
  const duplicate = payrollRuns.find(r => r.periodStart === periodStart);

  const roster = employees.filter(e => selected.includes(e.id));
  const previewSlips = useMemo(
    () => roster.map(e => buildPayslip('preview', e, {
      bonus: adjustments[e.id]?.bonus ?? 0,
      otherDeductions: adjustments[e.id]?.otherDeductions ?? 0,
    })),
    [roster, adjustments]
  );
  const totals = summarisePayslips(previewSlips);

  const visible = eligible.filter(e =>
    !search || `${e.firstName} ${e.lastName} ${e.jobTitle}`.toLowerCase().includes(search.toLowerCase())
  );

  function toggle(id: string) {
    setSelected(cur => cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]);
  }

  function submit() {
    const run = createPayrollRun({
      periodStart,
      payDate,
      employeeIds: selected,
      adjustments,
      note: note.trim() || undefined,
    });
    onClose();
    navigate(`/payroll/runs/${run.id}`);
  }

  const canAdvance = step === 1 ? Boolean(period && payDate && !duplicate) : step === 2 ? selected.length > 0 : true;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width="max-w-4xl"
      title="New Payroll Run"
      description={`Step ${step} of ${wizardSteps.length}: ${wizardSteps[step - 1].label}`}
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
          {step > 1 && <Button variant="outline" size="sm" onClick={() => setStep(step - 1)}>Back</Button>}
          {step < 4 && <Button size="sm" disabled={!canAdvance} rightIcon={<ChevronRight className="h-3.5 w-3.5" />} onClick={() => setStep(step + 1)}>Continue</Button>}
          {step === 4 && <Button size="sm" disabled={selected.length === 0} leftIcon={<Check className="h-3.5 w-3.5" />} onClick={submit}>Create Draft Run</Button>}
        </>
      }
    >
      <div className="px-4 sm:px-6 pt-5">
        <div className="flex items-center gap-1">
          {wizardSteps.map((s, i) => {
            const done = s.id < step;
            const active = s.id === step;
            return (
              <div key={s.id} className="flex items-center gap-1 flex-1">
                <button onClick={() => s.id < step && setStep(s.id)} className="flex items-center gap-2 min-w-0">
                  <span className={[
                    'h-7 w-7 rounded-md flex items-center justify-center flex-shrink-0 border',
                    done ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : active ? 'bg-ink-900 border-ink-900 text-white' : 'bg-white border-ink-200 text-ink-400',
                  ].join(' ')}>
                    {done ? <Check className="h-3.5 w-3.5" /> : s.icon}
                  </span>
                  <span className={['text-xs font-medium truncate', active ? 'text-ink-900' : 'text-ink-500'].join(' ')}>{s.label}</span>
                </button>
                {i < wizardSteps.length - 1 && <span className="h-px flex-1 bg-ink-200" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Pay Period">
                <Input type="month" value={period} onChange={e => setPeriod(e.target.value)} />
              </Field>
              <Field label="Pay Date">
                <Input type="date" value={payDate} onChange={e => setPayDate(e.target.value)} />
              </Field>
            </div>
            {duplicate && (
              <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3">
                <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">
                  A run for <span className="font-semibold">{monthLabel(periodStart)}</span> already exists
                  ({duplicate.status}). Choose another period to avoid paying twice.
                </p>
              </div>
            )}
            <Field label="Note (optional)">
              <Input value={note} onChange={e => setNote(e.target.value)} placeholder="e.g. Includes Q3 performance bonuses" />
            </Field>
            <div className="rounded-lg border border-ink-200 bg-ink-50/60 p-4">
              <p className="text-xs text-ink-600">
                {eligible.length} employees are eligible for this run. Contractors are excluded from PAYE,
                pension and NHF; their statutory schemes do not apply.
              </p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees…" className="max-w-xs" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-ink-500">{selected.length} of {eligible.length} selected</span>
                <Button variant="outline" size="xs" onClick={() => setSelected(eligible.map(e => e.id))}>Select All</Button>
                <Button variant="outline" size="xs" onClick={() => setSelected([])}>Clear</Button>
              </div>
            </div>
            <div className="border border-ink-200 rounded-lg overflow-hidden max-h-[420px] overflow-y-auto scrollbar-thin">
              <Table>
                <THead><tr><Th className="w-10" /><Th>Employee</Th><Th>Type</Th><Th>Annual Gross</Th><Th>Monthly Net</Th></tr></THead>
                <TBody>
                  {visible.map(e => {
                    const on = selected.includes(e.id);
                    const c = computePayroll(e.salary, {
                      pensionApplies: statutorySchemesApply(e),
                      nhfApplies: statutorySchemesApply(e),
                    });
                    return (
                      <Tr key={e.id} onClick={() => toggle(e.id)}>
                        <Td>
                          <span className={[
                            'h-4 w-4 rounded border flex items-center justify-center',
                            on ? 'bg-ink-900 border-ink-900 text-white' : 'bg-white border-ink-300',
                          ].join(' ')}>
                            {on && <Check className="h-3 w-3" />}
                          </span>
                        </Td>
                        <Td>
                          <div className="flex items-center gap-2">
                            <Avatar name={`${e.firstName} ${e.lastName}`} size={26} />
                            <div>
                              <p className="text-sm font-medium text-ink-900">{e.firstName} {e.lastName}</p>
                              <p className="text-[11px] text-ink-500">{e.jobTitle}</p>
                            </div>
                          </div>
                        </Td>
                        <Td>
                          <Badge tone={e.employmentType === 'contractor' ? 'amber' : 'gray'}>
                            {e.employmentType.replace('_', ' ')}
                          </Badge>
                        </Td>
                        <Td className="text-sm">{formatCurrency(e.salary)}</Td>
                        <Td className="text-sm font-medium text-emerald-700">{formatCurrency(c.monthlyNet)}</Td>
                      </Tr>
                    );
                  })}
                </TBody>
              </Table>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <p className="text-xs text-ink-500">
              Add one-off bonuses or deductions for this run only. Bonuses increase gross pay; other
              deductions are applied after statutory items.
            </p>
            <div className="border border-ink-200 rounded-lg overflow-hidden max-h-[420px] overflow-y-auto scrollbar-thin">
              <Table>
                <THead><tr><Th>Employee</Th><Th className="w-40">Bonus</Th><Th className="w-40">Other Deduction</Th><Th>Net Pay</Th></tr></THead>
                <TBody>
                  {roster.map(e => {
                    const slip = previewSlips.find(s => s.employeeId === e.id);
                    return (
                      <Tr key={e.id}>
                        <Td>
                          <p className="text-sm font-medium text-ink-900">{e.firstName} {e.lastName}</p>
                          <p className="text-[11px] text-ink-500">{e.jobTitle}</p>
                        </Td>
                        <Td>
                          <Input type="number" min={0} step={10000} value={adjustments[e.id]?.bonus ?? 0}
                            onChange={ev => setAdjustments(cur => ({ ...cur, [e.id]: { ...cur[e.id], bonus: Number(ev.target.value) || 0 } }))} />
                        </Td>
                        <Td>
                          <Input type="number" min={0} step={10000} value={adjustments[e.id]?.otherDeductions ?? 0}
                            onChange={ev => setAdjustments(cur => ({ ...cur, [e.id]: { ...cur[e.id], otherDeductions: Number(ev.target.value) || 0 } }))} />
                        </Td>
                        <Td className="text-sm font-semibold text-emerald-700">{slip ? formatCurrency(slip.net) : '—'}</Td>
                      </Tr>
                    );
                  })}
                </TBody>
              </Table>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <MiniStat label="Employees" value={String(totals.employees)} />
              <MiniStat label="Gross" value={formatCurrency(totals.gross)} />
              <MiniStat label="Deductions" value={formatCurrency(totals.deductions)} tone="red" />
              <MiniStat label="Net Pay" value={formatCurrency(totals.net)} tone="green" />
            </div>
            <Card>
              <CardHeader title="Statutory Breakdown" subtitle={`${monthLabel(periodStart)} • pay date ${formatDate(payDate)}`} />
              <CardBody className="space-y-2">
                <SummaryRow label="PAYE (employee)" value={formatCurrency(totals.paye)} />
                <SummaryRow label="Pension — employee 8%" value={formatCurrency(totals.pension)} />
                <SummaryRow label="NHF — employee 2.5%" value={formatCurrency(totals.nhf)} />
                <div className="border-t border-ink-200 pt-2">
                  <SummaryRow label="Total employee deductions" value={formatCurrency(totals.deductions)} tone="red" />
                  <SummaryRow label="Employer contributions (pension 10%, NSITF 1%, ITF 1%)" value={formatCurrency(totals.employerCost)} />
                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-ink-200">
                    <span className="text-sm font-semibold text-ink-900">Total payroll cost</span>
                    <span className="text-lg font-semibold text-ink-900">{formatCurrency(totals.gross + totals.employerCost)}</span>
                  </div>
                </div>
              </CardBody>
            </Card>
            <div className="rounded-md border border-ink-200 bg-ink-50 p-3 text-xs text-ink-600">
              This creates a <span className="font-semibold">draft</span> run. Nothing is disbursed until it is
              approved, processed and marked paid.
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}

// ----------------------------------------------------------- run detail

export function PayrollRunDetailPage({ path, navigate }: RouteProps) {
  const { payrollRuns, payslips, approvePayrollRun, processPayrollRun, markPayrollRunPaid } = useMockData();
  const id = path.split('/').pop() || '';
  const run = payrollRuns.find(r => r.id === id);
  const slips = payslips.filter(p => p.runId === id);
  const [openSlip, setOpenSlip] = useState<Payslip | null>(null);
  const [page, setPage] = useState(1);

  if (!run) {
    return (
      <div className="p-4 sm:p-6">
        <EmptyState icon={<Wallet className="h-5 w-5" />} title="Payroll run not found"
          action={<Button size="sm" onClick={() => navigate('/payroll')}>Back to Payroll Runs</Button>} />
      </div>
    );
  }

  const totalPages = Math.max(1, Math.ceil(slips.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = slips.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return (
    <div>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[
          { label: 'Payroll', onClick: () => navigate('/payroll') },
          { label: run.period },
        ]} />}
        title={`Payroll — ${run.period}`}
        description={`${run.employees} employees • pay date ${formatDate(run.payDate)} • run by ${run.runBy}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" leftIcon={<ArrowLeft className="h-3.5 w-3.5" />} onClick={() => navigate('/payroll')}>Back</Button>
            {run.status === 'draft' && <Button size="sm" leftIcon={<Check className="h-3.5 w-3.5" />} onClick={() => approvePayrollRun(run.id)}>Approve Run</Button>}
            {run.status === 'approved' && <Button size="sm" leftIcon={<Play className="h-3.5 w-3.5" />} onClick={() => processPayrollRun(run.id)}>Process Payment</Button>}
            {run.status === 'processing' && <Button size="sm" leftIcon={<CheckCircle2 className="h-3.5 w-3.5" />} onClick={() => markPayrollRunPaid(run.id)}>Mark as Paid</Button>}
            {run.status === 'paid' && <Badge tone="green" dot>Disbursed {run.paidAt ? formatDate(run.paidAt) : ''}</Badge>}
          </div>
        }
      />

      <div className="p-4 sm:p-6 space-y-4">
        <RunProgress status={run.status} />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat label="Gross" value={formatCurrency(run.gross)} tone="gray" />
          <Stat label="Deductions" value={formatCurrency(run.deductions)} delta={`${((run.deductions / run.gross) * 100).toFixed(1)}% of gross`} tone="red" />
          <Stat label="Net Pay" value={formatCurrency(run.net)} tone="green" />
          <Stat label="Employer Cost" value={formatCurrency(run.employerCost)} delta="Pension, NSITF, ITF" tone="gray" />
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader title="Payslips" subtitle={`${slips.length} employees in this run`}
              action={<Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>Export</Button>} />
            <CardBody className="p-0">
              <Table>
                <THead><tr><Th>Employee</Th><Th>Gross</Th><Th>PAYE</Th><Th>Pension</Th><Th>NHF</Th><Th>Net</Th><Th>Status</Th></tr></THead>
                <TBody>
                  {paged.map(slip => (
                    <Tr key={slip.id} onClick={() => setOpenSlip(slip)}>
                      <Td>
                        <div className="flex items-center gap-2">
                          <Avatar name={slip.employeeName} size={26} />
                          <div>
                            <p className="text-sm font-medium text-ink-900">{slip.employeeName}</p>
                            <p className="text-[11px] text-ink-500">{slip.jobTitle}</p>
                          </div>
                        </div>
                      </Td>
                      <Td className="text-sm">{formatCurrency(slip.gross)}</Td>
                      <Td className="text-sm text-red-600">-{formatCurrency(slip.paye)}</Td>
                      <Td className="text-sm text-red-600">-{formatCurrency(slip.pension)}</Td>
                      <Td className="text-sm text-red-600">-{formatCurrency(slip.nhf)}</Td>
                      <Td className="text-sm font-semibold text-emerald-700">{formatCurrency(slip.net)}</Td>
                      <Td><StatusBadge status={slip.status} /></Td>
                    </Tr>
                  ))}
                </TBody>
              </Table>
              <Pagination page={safePage} totalPages={totalPages} onPage={setPage} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Statutory Remittances" subtitle="Payable alongside this run" />
            <CardBody className="space-y-2">
              <SummaryRow label="PAYE to State IRS" value={formatCurrency(run.paye)} />
              <SummaryRow label="Pension — employee (8%)" value={formatCurrency(run.pension)} />
              <SummaryRow label="NHF (2.5%)" value={formatCurrency(run.nhf)} />
              <div className="border-t border-ink-200 pt-2 mt-2">
                <SummaryRow label="Employer contributions" value={formatCurrency(run.employerCost)} />
                <div className="flex items-center justify-between pt-2 mt-2 border-t border-ink-200">
                  <span className="text-sm font-semibold text-ink-900">Total cost to company</span>
                  <span className="text-base font-semibold text-ink-900">{formatCurrency(run.gross + run.employerCost)}</span>
                </div>
              </div>
              {run.note && <p className="text-[11px] text-ink-500 pt-2 border-t border-ink-200 mt-2">{run.note}</p>}
            </CardBody>
          </Card>
        </div>
      </div>

      <PayslipDrawer slip={openSlip} onClose={() => setOpenSlip(null)} period={run.period} payDate={run.payDate} />
    </div>
  );
}

function RunProgress({ status }: { status: PayrollRun['status'] }) {
  const stages = ['draft', 'approved', 'processing', 'paid'];
  const index = stages.indexOf(status);
  return (
    <Card>
      <CardBody className="py-4">
        <div className="flex items-center gap-2">
          {stages.map((stage, i) => {
            const done = i <= index;
            return (
              <div key={stage} className="flex items-center gap-2 flex-1">
                <span className={[
                  'h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0',
                  done ? 'bg-emerald-600 text-white' : 'bg-ink-100 text-ink-400',
                ].join(' ')}>
                  {done ? <Check className="h-3 w-3" /> : i + 1}
                </span>
                <span className={['text-xs font-medium capitalize', done ? 'text-ink-900' : 'text-ink-400'].join(' ')}>{stage}</span>
                {i < stages.length - 1 && <span className={['h-px flex-1', i < index ? 'bg-emerald-500' : 'bg-ink-200'].join(' ')} />}
              </div>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}

// ---------------------------------------------------------- payslip detail

function PayslipDrawer({ slip, onClose, period, payDate }: { slip: Payslip | null; onClose: () => void; period: string; payDate: string }) {
  if (!slip) return null;
  const bands = computePayroll(slip.annualGross, {
    pensionApplies: slip.pension > 0,
    nhfApplies: slip.nhf > 0,
  });

  return (
    <Drawer
      open={!!slip}
      onClose={onClose}
      width="max-w-2xl"
      title={`Payslip — ${slip.employeeName}`}
      description={`${period} • pay date ${formatDate(payDate)}`}
      footer={<><Button variant="ghost" size="sm" onClick={onClose}>Close</Button><Button size="sm" leftIcon={<Download className="h-3.5 w-3.5" />} onClick={() => window.print()}>Download PDF</Button></>}
    >
      <div className="p-4 sm:p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <MiniStat label="Gross" value={formatCurrency(slip.gross)} />
          <MiniStat label="Deductions" value={formatCurrency(slip.deductions)} tone="red" />
          <MiniStat label="Net Pay" value={formatCurrency(slip.net)} tone="green" />
        </div>

        <Card>
          <CardHeader title="Employee" />
          <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-xs">
            <DetailRow label="Job Title" value={slip.jobTitle} />
            <DetailRow label="Level" value={slip.level} />
            <DetailRow label="Bank" value={slip.bankName || '—'} />
            <DetailRow label="Account" value={slip.accountNumber || '—'} />
            <DetailRow label="TIN" value={slip.tin || '—'} />
            <DetailRow label="Pension ID" value={slip.pensionId || '—'} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Earnings" />
          <CardBody className="space-y-2">
            <SummaryRow label="Basic monthly gross" value={formatCurrency(slip.gross - slip.bonus)} />
            {slip.bonus > 0 && <SummaryRow label="Bonus" value={formatCurrency(slip.bonus)} tone="green" />}
            <div className="border-t border-ink-200 pt-2">
              <SummaryRow label="Total earnings" value={formatCurrency(slip.gross)} />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Deductions" subtitle="Statutory items computed on annual gross" />
          <CardBody className="space-y-2">
            <SummaryRow label="PAYE" value={`-${formatCurrency(slip.paye)}`} tone="red" />
            <SummaryRow label="Pension (8%)" value={`-${formatCurrency(slip.pension)}`} tone="red" />
            <SummaryRow label="NHF (2.5%)" value={`-${formatCurrency(slip.nhf)}`} tone="red" />
            {slip.otherDeductions > 0 && <SummaryRow label="Other deductions" value={`-${formatCurrency(slip.otherDeductions)}`} tone="red" />}
            <div className="border-t border-ink-200 pt-2">
              <SummaryRow label="Total deductions" value={`-${formatCurrency(slip.deductions)}`} tone="red" />
              <div className="flex items-center justify-between pt-2 mt-2 border-t border-ink-200">
                <span className="text-sm font-semibold text-ink-900">Net pay</span>
                <span className="text-lg font-semibold text-emerald-700">{formatCurrency(slip.net)}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="PAYE Computation" subtitle="Annualised, per the Personal Income Tax Act" />
          <CardBody className="space-y-2">
            <SummaryRow label="Annual gross" value={formatCurrency(slip.annualGross)} />
            <SummaryRow label="Consolidated Relief Allowance" value={`-${formatCurrency(slip.cra)}`} />
            <SummaryRow label="Pension + NHF relief" value={`-${formatCurrency(bands.annualPension + bands.annualNhf)}`} />
            <SummaryRow label="Taxable income" value={formatCurrency(slip.taxableIncome)} />
            <div className="border-t border-ink-200 pt-2 mt-1 space-y-1">
              {bands.bands.filter(b => b.amountInBand > 0).map(band => (
                <div key={band.label} className="flex items-center justify-between text-[11px]">
                  <span className="text-ink-500">{band.label} @ {(band.rate * 100).toFixed(0)}%</span>
                  <span className="text-ink-700">{formatCurrency(band.tax)}</span>
                </div>
              ))}
              {bands.minimumTaxApplied && (
                <p className="text-[11px] text-amber-700">Minimum tax of 1% of gross applied — reliefs exceeded taxable income.</p>
              )}
            </div>
            <div className="border-t border-ink-200 pt-2">
              <SummaryRow label="Annual PAYE" value={formatCurrency(bands.annualPaye)} />
              <SummaryRow label="Monthly PAYE" value={formatCurrency(slip.paye)} tone="red" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Employer Contributions" subtitle="Not deducted from the employee" />
          <CardBody className="space-y-2">
            <SummaryRow label="Pension (10%)" value={formatCurrency(slip.employerPension)} />
            <SummaryRow label="NSITF (1%)" value={formatCurrency(slip.nsitf)} />
            <SummaryRow label="ITF (1%)" value={formatCurrency(slip.itf)} />
            <div className="border-t border-ink-200 pt-2">
              <SummaryRow label="Total employer cost" value={formatCurrency(slip.employerCost)} />
            </div>
          </CardBody>
        </Card>
      </div>
    </Drawer>
  );
}

// -------------------------------------------------------------- payslips page

export function PayslipsPage({ navigate }: RouteProps) {
  const { payrollRuns, payslips } = useMockData();
  const [runId, setRunId] = useState(payrollRuns[0]?.id ?? '');
  const [page, setPage] = useState(1);
  const [openSlip, setOpenSlip] = useState<Payslip | null>(null);

  const run = payrollRuns.find(r => r.id === runId) ?? payrollRuns[0];
  const slips = payslips.filter(p => p.runId === run?.id);
  const totalPages = Math.max(1, Math.ceil(slips.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paged = slips.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  if (!run) {
    return (
      <div className="p-4 sm:p-6">
        <EmptyState icon={<FileText className="h-5 w-5" />} title="No payslips yet"
          description="Create a payroll run to generate payslips."
          action={<Button size="sm" onClick={() => navigate('/payroll')}>Go to Payroll Runs</Button>} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: 'Payroll', onClick: () => navigate('/payroll') }, { label: 'Payslips' }]} />}
        title="Payslips"
        description={`${slips.length} payslips for ${run.period}`}
        actions={
          <div className="flex items-center gap-2">
            <FilterSelect label="Run" value={runId} onChange={v => { setRunId(v || run.id); setPage(1); }}
              options={payrollRuns.map(r => ({ value: r.id, label: r.period }))} />
            <Button size="sm" variant="outline" leftIcon={<Download className="h-3.5 w-3.5" />}>Export All</Button>
          </div>
        }
      />
      <div className="bg-white">
        <Table>
          <THead><tr><Th>Employee</Th><Th>Job Title</Th><Th>Gross</Th><Th>PAYE</Th><Th>Deductions</Th><Th>Net Pay</Th><Th>Status</Th><Th /></tr></THead>
          <TBody>
            {paged.map(slip => (
              <Tr key={slip.id} onClick={() => setOpenSlip(slip)}>
                <Td>
                  <div className="flex items-center gap-2">
                    <Avatar name={slip.employeeName} size={26} />
                    <span className="text-sm font-medium text-ink-900">{slip.employeeName}</span>
                  </div>
                </Td>
                <Td className="text-sm">{slip.jobTitle}</Td>
                <Td className="text-sm">{formatCurrency(slip.gross)}</Td>
                <Td className="text-sm text-red-600">-{formatCurrency(slip.paye)}</Td>
                <Td className="text-sm text-red-600">-{formatCurrency(slip.deductions)}</Td>
                <Td className="text-sm font-semibold text-emerald-700">{formatCurrency(slip.net)}</Td>
                <Td><StatusBadge status={slip.status} /></Td>
                <Td><Button variant="ghost" size="xs" onClick={() => setOpenSlip(slip)}>View</Button></Td>
              </Tr>
            ))}
          </TBody>
        </Table>
        <Pagination page={safePage} totalPages={totalPages} onPage={setPage} />
      </div>
      <PayslipDrawer slip={openSlip} onClose={() => setOpenSlip(null)} period={run.period} payDate={run.payDate} />
    </div>
  );
}

// ------------------------------------------------------- salary structure

export function SalaryStructurePage({ navigate }: RouteProps) {
  const { employees } = useMockData();

  // Bands are derived from who actually sits at each level, so the table tracks the directory.
  const bands = useMemo(() => {
    const levels = ['L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'];
    const names: Record<string, string> = {
      L1: 'Junior', L2: 'Junior-Mid', L3: 'Mid', L4: 'Mid-Senior',
      L5: 'Senior', L6: 'Staff', L7: 'Manager', L8: 'Senior Manager+',
    };
    return levels.map(level => {
      const at = employees.filter(e => e.level === level);
      const salaries = at.map(e => e.salary);
      return {
        level,
        label: `${level} (${names[level]})`,
        min: salaries.length ? Math.min(...salaries) : 0,
        max: salaries.length ? Math.max(...salaries) : 0,
        avg: salaries.length ? salaries.reduce((a, b) => a + b, 0) / salaries.length : 0,
        count: at.length,
      };
    });
  }, [employees]);

  const ceiling = Math.max(...bands.map(b => b.max), 1);

  return (
    <div>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: 'Payroll', onClick: () => navigate('/payroll') }, { label: 'Salary Structure' }]} />}
        title="Salary Structure"
        description="Live salary bands derived from the employee directory."
      />
      <div className="p-4 sm:p-6 space-y-4">
        <Card>
          <CardHeader title="Salary Bands" subtitle="Min, max and average annual gross by level" />
          <CardBody className="p-0">
            <Table>
              <THead><tr><Th>Level</Th><Th>Min</Th><Th>Average</Th><Th>Max</Th><Th>Spread</Th><Th>Employees</Th></tr></THead>
              <TBody>
                {bands.map(b => (
                  <Tr key={b.level}>
                    <Td className="text-sm font-medium text-ink-900">{b.label}</Td>
                    <Td className="text-sm">{b.count ? formatCurrency(b.min) : '—'}</Td>
                    <Td className="text-sm">{b.count ? formatCurrency(b.avg) : '—'}</Td>
                    <Td className="text-sm">{b.count ? formatCurrency(b.max) : '—'}</Td>
                    <Td className="w-40"><ProgressBar value={Math.round((b.max / ceiling) * 100)} /></Td>
                    <Td className="text-sm">{b.count}</Td>
                  </Tr>
                ))}
              </TBody>
            </Table>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="PAYE Bands" subtitle="Progressive rates applied to annual taxable income" />
          <CardBody className="p-0">
            <Table>
              <THead><tr><Th>Band</Th><Th>Rate</Th></tr></THead>
              <TBody>
                {PAYE_BANDS.map(band => (
                  <Tr key={band.label}>
                    <Td className="text-sm">{band.label}</Td>
                    <Td className="text-sm font-medium">{(band.rate * 100).toFixed(0)}%</Td>
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

// ------------------------------------------------------------ customers

export function CustomerListPage({ navigate }: RouteProps) {
  const { invoices } = useMockData();
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Customers' }]} />} title="Customers"
        description="Active customer accounts" actions={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>Add Customer</Button>} />
      <div className="bg-white">
        <Table>
          <THead><tr><Th>Customer</Th><Th>Company</Th><Th>Plan</Th><Th>MRR</Th><Th>Outstanding</Th><Th>Status</Th><Th>Owner</Th></tr></THead>
          <TBody>
            {customers.map(c => {
              const owed = invoices.filter(i => i.customerId === c.id).reduce((a, i) => a + i.balance, 0);
              return (
                <Tr key={c.id} onClick={() => navigate('/customers/invoices')}>
                  <Td><div><p className="text-sm font-medium text-ink-900">{c.name}</p><p className="text-[11px] text-ink-500">{c.email}</p></div></Td>
                  <Td className="text-sm">{c.company}</Td>
                  <Td><span className="text-xs font-medium px-2 py-0.5 rounded-md bg-ink-100 text-ink-700 capitalize">{c.plan}</span></Td>
                  <Td className="text-sm font-medium">{formatCurrency(c.mrr)}/mo</Td>
                  <Td className={`text-sm font-medium ${owed > 0 ? 'text-ink-900' : 'text-ink-400'}`}>{owed > 0 ? formatCurrency(owed) : '—'}</Td>
                  <Td><StatusBadge status={c.status} /></Td>
                  <Td className="text-sm">{c.owner}</Td>
                </Tr>
              );
            })}
          </TBody>
        </Table>
      </div>
    </div>
  );
}

export function ContractsPage({ navigate }: RouteProps) {
  const { createInvoice } = useMockData();
  const [billing, setBilling] = useState<typeof contracts[number] | null>(null);

  const contracts = customers.slice(0, 12).map((c, i) => ({
    id: c.id, customer: c.company, plan: c.plan, mrr: c.mrr,
    term: ['12 mo', '36 mo', '24 mo', '1 mo'][i % 4],
    status: c.status === 'active' ? 'active' : c.status,
    startDate: c.signupDate,
    renewalDate: new Date(new Date(c.signupDate).setFullYear(new Date(c.signupDate).getFullYear() + 1)).toISOString().slice(0, 10),
  }));

  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'Customers', onClick: () => navigate('/customers') }, { label: 'Contracts' }]} />}
        title="Contracts" description={`${contracts.length} active customer contracts`}
        actions={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>New Contract</Button>} />
      <div className="bg-white">
        <Table>
          <THead><tr><Th>Customer</Th><Th>Plan</Th><Th>MRR</Th><Th>Term</Th><Th>Start</Th><Th>Renewal</Th><Th>Status</Th><Th /></tr></THead>
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
                <Td>
                  {c.mrr > 0 && <Button variant="ghost" size="xs" onClick={() => setBilling(c)}>Raise Invoice</Button>}
                </Td>
              </Tr>
            ))}
          </TBody>
        </Table>
      </div>

      <Modal
        open={!!billing}
        onClose={() => setBilling(null)}
        title="Raise Invoice from Contract"
        description={billing ? `${billing.customer} • ${formatCurrency(billing.mrr)}/mo` : ''}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setBilling(null)}>Cancel</Button>
            <Button size="sm" onClick={() => {
              if (!billing) return;
              createInvoice({
                customerId: billing.id,
                issueDate: new Date().toISOString().slice(0, 10),
                termsDays: 30,
                whtRate: 0,
                notes: `Monthly subscription for ${billing.customer}.`,
                lines: [{ description: `${billing.plan} plan — monthly subscription`, quantity: 1, unitPrice: billing.mrr, taxable: true }],
                send: true,
              });
              setBilling(null);
              navigate('/customers/invoices');
            }}>Create & Send</Button>
          </>
        }
      >
        <p className="text-sm text-ink-600">
          This raises a Net 30 invoice for one month of the {billing?.plan} plan, adds 7.5% VAT, and issues it
          immediately.
        </p>
      </Modal>
    </div>
  );
}

// ------------------------------------------------------------------ helpers

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink-700 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone?: 'red' | 'green' }) {
  const color = tone === 'red' ? 'text-red-600' : tone === 'green' ? 'text-emerald-700' : 'text-ink-900';
  return (
    <div className="rounded-lg border border-ink-200 bg-white p-3">
      <p className="text-[10px] font-mono uppercase tracking-[0.08em] text-ink-500">{label}</p>
      <p className={`text-base font-semibold mt-1 ${color}`}>{value}</p>
    </div>
  );
}

function SummaryRow({ label, value, tone }: { label: string; value: string; tone?: 'red' | 'green' }) {
  const color = tone === 'red' ? 'text-red-600' : tone === 'green' ? 'text-emerald-700' : 'text-ink-900';
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-ink-600">{label}</span>
      <span className={`text-sm font-medium ${color}`}>{value}</span>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-ink-500">{label}</span>
      <span className="text-ink-900 font-medium truncate">{value}</span>
    </div>
  );
}
