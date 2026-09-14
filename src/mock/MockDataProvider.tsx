import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  assets as seedAssets,
  employees as seedEmployees,
  leaveRequests as seedLeaveRequests,
  customers as seedCustomers,
  invoices as seedInvoices,
  payrollRuns as seedPayrollRuns,
  payslips as seedPayslips,
  addDays,
  buildPayslip,
  calcInvoiceTotals,
  deriveInvoiceStatus,
  summarisePayslips,
  type Asset,
  type Employee,
  type Invoice,
  type InvoiceLine,
  type InvoicePayment,
  type LeaveRequest,
  type PayrollRun,
  type Payslip,
} from '../data/seed';
import { VAT_RATE } from '../lib/tax';

const STORAGE_KEY = 'guideos-mock-state-v2';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  tone: 'amber' | 'blue' | 'red' | 'green';
  module: string;
  read: boolean;
}

export interface OnboardingDraft {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  country: string;
  city: string;
  residentialAddress: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyRelationship: string;
  jobTitle: string;
  departmentId: string;
  teamId: string;
  employmentType: Employee['employmentType'];
  managerId: string;
  level: string;
  startDate: string;
  workLocation: string;
  annualSalary: string;
  probationPeriod: string;
  bankName: string;
  accountType: string;
  accountName: string;
  accountNumber: string;
  bvn: string;
  sortCode: string;
  swiftCode: string;
  tin: string;
  filingState: string;
  nin: string;
  taxResidency: string;
  nsitfNumber: string;
  itfNumber: string;
  pfa: string;
  pensionAccountNumber: string;
  nhfNumber: string;
  healthInsuranceProvider: string;
  healthPlan: string;
  uploadedDocuments: string[];
  confirmed: boolean;
}

interface MockState {
  employees: Employee[];
  assets: Asset[];
  leaveRequests: LeaveRequest[];
  invoices: Invoice[];
  payrollRuns: PayrollRun[];
  payslips: Payslip[];
  notifications: NotificationItem[];
  onboardingDraft: OnboardingDraft;
}

interface CreateEmployeeInput extends OnboardingDraft {}

interface CreateAssetInput {
  name: string;
  type: Asset['type'];
  brand: string;
  model: string;
  serial: string;
  purchaseValue: number;
  location: string;
}

export interface InvoiceDraftInput {
  customerId: string;
  issueDate: string;
  termsDays: number;
  whtRate: number;
  vatRate?: number;
  notes?: string;
  lines: Omit<InvoiceLine, 'id'>[];
  /** Issue immediately rather than saving as a draft. */
  send?: boolean;
}

export interface RecordPaymentInput {
  amount: number;
  date: string;
  method: InvoicePayment['method'];
  reference: string;
  note?: string;
}

export interface PayrollRunInput {
  periodStart: string;
  payDate: string;
  runBy?: string;
  note?: string;
  /** Employee ids to include; adjustments keyed by employee id. */
  employeeIds: string[];
  adjustments?: Record<string, { bonus?: number; otherDeductions?: number }>;
}

interface MockDataContextValue extends MockState {
  setOnboardingDraft: (draft: OnboardingDraft) => void;
  resetOnboardingDraft: () => void;
  createEmployeeFromOnboarding: (input: CreateEmployeeInput) => Employee;
  approveLeaveRequest: (id: string) => void;
  rejectLeaveRequest: (id: string) => void;
  createAsset: (input: CreateAssetInput) => Asset;
  assignAssetToEmployee: (assetId: string, employeeId: string) => void;
  markAllNotificationsRead: () => void;

  createInvoice: (input: InvoiceDraftInput) => Invoice;
  updateInvoice: (id: string, input: InvoiceDraftInput) => void;
  sendInvoice: (id: string) => void;
  recordInvoicePayment: (id: string, payment: RecordPaymentInput) => void;
  cancelInvoice: (id: string) => void;
  deleteInvoice: (id: string) => void;

  createPayrollRun: (input: PayrollRunInput) => PayrollRun;
  approvePayrollRun: (id: string) => void;
  processPayrollRun: (id: string) => void;
  markPayrollRunPaid: (id: string) => void;
  deletePayrollRun: (id: string) => void;
}

const initialNotifications: NotificationItem[] = [
  { id: 'n-001', title: '5 leave requests pending approval', body: 'Tunde, Chioma, and 3 others have requested leave that requires your approval.', time: '2h ago', tone: 'amber', module: 'Leave', read: false },
  { id: 'n-002', title: 'Payroll run for June 2025 is ready to review', body: 'Fatima has submitted the payroll run. Approval needed before June 28.', time: '5h ago', tone: 'blue', module: 'Payroll', read: false },
  { id: 'n-003', title: '2 urgent support tickets unassigned', body: 'Tickets related to login and payslip download have not been picked up.', time: '6h ago', tone: 'red', module: 'Support', read: false },
  { id: 'n-004', title: 'New hire onboarding complete: Adaobi Okoye', body: 'All 9 checklist steps completed. Welcome packet sent.', time: '1d ago', tone: 'green', module: 'Onboarding', read: false },
  { id: 'n-005', title: 'Compliance: PAYE filing overdue for May', body: 'Filing due June 10. Please review and file immediately.', time: '1d ago', tone: 'red', module: 'Compliance', read: false },
  { id: 'n-006', title: 'New opportunity in negotiation stage', body: 'GuideOS Enterprise deal worth $145k moved to Negotiation.', time: '2d ago', tone: 'amber', module: 'CRM', read: false },
  { id: 'n-007', title: '8 expense reports awaiting approval', body: 'Total value: $4,231 across 6 employees.', time: '2d ago', tone: 'amber', module: 'Finance', read: false },
];

export const defaultOnboardingDraft: OnboardingDraft = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  gender: 'Prefer not to say',
  country: 'Nigeria',
  city: 'Lagos',
  residentialAddress: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  emergencyRelationship: 'Spouse',
  jobTitle: '',
  departmentId: 'd-eng',
  teamId: 't-be',
  employmentType: 'full_time',
  managerId: 'e-002',
  level: 'L4',
  startDate: '',
  workLocation: 'Lagos (HQ)',
  annualSalary: '',
  probationPeriod: '3 months',
  bankName: 'GTBank',
  accountType: 'Savings',
  accountName: '',
  accountNumber: '',
  bvn: '',
  sortCode: '',
  swiftCode: '',
  tin: '',
  filingState: 'Lagos',
  nin: '',
  taxResidency: 'Resident',
  nsitfNumber: '',
  itfNumber: '',
  pfa: 'Stanbic IBTC Pension',
  pensionAccountNumber: '',
  nhfNumber: '',
  healthInsuranceProvider: 'AXA Mansard',
  healthPlan: 'Family',
  uploadedDocuments: [],
  confirmed: false,
};

const initialState: MockState = {
  employees: seedEmployees,
  assets: seedAssets,
  leaveRequests: seedLeaveRequests,
  invoices: seedInvoices,
  payrollRuns: seedPayrollRuns,
  payslips: seedPayslips,
  notifications: initialNotifications,
  onboardingDraft: defaultOnboardingDraft,
};

const MockDataContext = createContext<MockDataContextValue | null>(null);

function cloneInitialState(): MockState {
  return JSON.parse(JSON.stringify(initialState)) as MockState;
}

function getStoredState(): MockState {
  if (typeof window === 'undefined') return cloneInitialState();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return cloneInitialState();
  try {
    return {
      ...cloneInitialState(),
      ...JSON.parse(raw),
    } as MockState;
  } catch {
    return cloneInitialState();
  }
}

function seedCustomerById(id: string) {
  return seedCustomers.find(customer => customer.id === id);
}

/** Sequential, year-scoped document number: INV-2026-0042. */
function nextInvoiceNumber(existing: Invoice[], issueDate: string) {
  const year = new Date(issueDate).getFullYear();
  const prefix = `INV-${year}-`;
  const max = existing.reduce((acc, invoice) => {
    if (!invoice.number.startsWith(prefix)) return acc;
    const seq = Number(invoice.number.slice(prefix.length));
    return Number.isFinite(seq) ? Math.max(acc, seq) : acc;
  }, 0);
  return `${prefix}${String(max + 1).padStart(4, '0')}`;
}

function formatNaira(n: number) {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(n);
}

function nextId(prefix: string, items: { id: string }[]) {
  const max = items.reduce((acc, item) => {
    const value = Number(item.id.replace(/^[^-]+-/, ''));
    return Number.isFinite(value) ? Math.max(acc, value) : acc;
  }, 0);
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
}

export function MockDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MockState>(() => getStoredState());

  // Mirrors the latest state so create* actions can build their record synchronously
  // and still return it to the caller (React may skip invoking a state updater).
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const pushNotification = useCallback(
    (n: Omit<NotificationItem, 'id' | 'time' | 'read'>, current: MockState): NotificationItem[] => [
      { ...n, id: `n-${Date.now()}-${current.notifications.length}`, time: 'just now', read: false },
      ...current.notifications,
    ],
    []
  );

  const setOnboardingDraft = useCallback((draft: OnboardingDraft) => {
    setState(current => ({ ...current, onboardingDraft: draft }));
  }, []);

  const resetOnboardingDraft = useCallback(() => {
    setState(current => ({ ...current, onboardingDraft: defaultOnboardingDraft }));
  }, []);

  const createEmployeeFromOnboarding = useCallback((input: CreateEmployeeInput) => {
    const current = stateRef.current;
    const manager = current.employees.find(employee => employee.id === input.managerId);
    const salary = Number(input.annualSalary) || 0;
    const id = nextId('e', current.employees);
    const createdEmployee: Employee = {
      id,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      jobTitle: input.jobTitle.trim(),
      departmentId: input.departmentId,
      teamIds: input.teamId ? [input.teamId] : [],
      managerId: input.managerId || undefined,
      status: 'probation',
      employmentType: input.employmentType,
      startDate: input.startDate,
      location: input.workLocation,
      country: input.country,
      salary,
      currency: 'NGN',
      bankName: input.bankName,
      accountNumber: input.accountNumber,
      taxId: input.tin || undefined,
      pensionId: input.pensionAccountNumber || undefined,
      nhfId: input.nhfNumber || undefined,
      tin: input.tin || undefined,
      level: input.level,
      pronouns: input.gender === 'Female' ? 'she/her' : input.gender === 'Male' ? 'he/him' : undefined,
      birthDate: input.dateOfBirth || undefined,
      emergencyContact: input.emergencyContactName ? {
        name: input.emergencyContactName,
        phone: input.emergencyContactPhone,
        relationship: input.emergencyRelationship,
      } : undefined,
      address: input.residentialAddress || undefined,
      onboardingProgress: 15,
    };

    setState(cur => ({
      ...cur,
      employees: [createdEmployee, ...cur.employees],
      notifications: pushNotification({
        title: `New hire created: ${createdEmployee.firstName} ${createdEmployee.lastName}`,
        body: `${createdEmployee.jobTitle} added to ${manager ? manager.firstName + "'s" : 'the'} reporting line and onboarding checklist started.`,
        tone: 'green',
        module: 'Onboarding',
      }, cur),
      onboardingDraft: defaultOnboardingDraft,
    }));

    return createdEmployee;
  }, [pushNotification]);

  const approveLeaveRequest = useCallback((id: string) => {
    setState(current => ({
      ...current,
      leaveRequests: current.leaveRequests.map(request => request.id === id ? {
        ...request,
        status: 'approved',
        approvedAt: new Date().toISOString(),
      } : request),
    }));
  }, []);

  const rejectLeaveRequest = useCallback((id: string) => {
    setState(current => ({
      ...current,
      leaveRequests: current.leaveRequests.map(request => request.id === id ? {
        ...request,
        status: 'rejected',
      } : request),
    }));
  }, []);

  const createAsset = useCallback((input: CreateAssetInput) => {
    const createdAsset: Asset = {
      id: nextId('a', stateRef.current.assets),
      name: input.name.trim(),
      type: input.type,
      brand: input.brand.trim(),
      model: input.model.trim(),
      serial: input.serial.trim(),
      status: 'available',
      purchaseDate: new Date().toISOString().slice(0, 10),
      purchaseValue: input.purchaseValue,
      location: input.location.trim(),
    };

    setState(cur => ({ ...cur, assets: [createdAsset, ...cur.assets] }));
    return createdAsset;
  }, []);

  const assignAssetToEmployee = useCallback((assetId: string, employeeId: string) => {
    setState(current => ({
      ...current,
      assets: current.assets.map(asset => asset.id === assetId ? {
        ...asset,
        assigneeId: employeeId,
        status: 'assigned',
        assignedAt: new Date().toISOString().slice(0, 10),
      } : asset),
    }));
  }, []);

  // ---------------------------------------------------------------- invoices

  const buildInvoiceFrom = useCallback((
    input: InvoiceDraftInput,
    current: MockState,
    existing?: Invoice
  ): Invoice => {
    const customer = seedCustomerById(input.customerId);
    const lines: InvoiceLine[] = input.lines.map((line, index) => ({
      ...line,
      id: `il-${Date.now()}-${index}`,
    }));
    const vatRate = input.vatRate ?? VAT_RATE;
    const amountPaid = existing?.amountPaid ?? 0;
    const totals = calcInvoiceTotals(lines, { vatRate, whtRate: input.whtRate, amountPaid });
    const dueDate = addDays(input.issueDate, input.termsDays);
    const issuing = input.send || (existing ? existing.status !== 'draft' : false);

    const base: Invoice = {
      id: existing?.id ?? nextId('inv', current.invoices),
      number: existing?.number ?? nextInvoiceNumber(current.invoices, input.issueDate),
      customerId: input.customerId,
      customerName: customer?.name ?? existing?.customerName ?? 'Unknown customer',
      customerCompany: customer?.company ?? existing?.customerCompany ?? '—',
      customerEmail: customer?.email ?? existing?.customerEmail ?? '',
      contractId: existing?.contractId,
      status: issuing ? 'sent' : 'draft',
      issueDate: input.issueDate,
      dueDate,
      termsDays: input.termsDays,
      currency: 'NGN',
      lines,
      ...totals,
      vatRate,
      whtRate: input.whtRate,
      payments: existing?.payments ?? [],
      notes: input.notes ?? existing?.notes,
      createdAt: existing?.createdAt ?? new Date().toISOString().slice(0, 10),
      sentAt: issuing ? existing?.sentAt ?? new Date().toISOString().slice(0, 10) : undefined,
      paidAt: existing?.paidAt,
    };

    return { ...base, status: deriveInvoiceStatus(base) };
  }, []);

  const createInvoice = useCallback((input: InvoiceDraftInput) => {
    // Built from the committed state rather than inside the updater: React may skip
    // invoking an updater, and the caller needs the new invoice back synchronously.
    const invoice = buildInvoiceFrom(input, stateRef.current);
    setState(current => ({
      ...current,
      invoices: [invoice, ...current.invoices],
      notifications: invoice.status === 'draft'
        ? current.notifications
        : pushNotification({
            title: `Invoice ${invoice.number} issued to ${invoice.customerCompany}`,
            body: `${formatNaira(invoice.amountDue)} due ${invoice.dueDate}.`,
            tone: 'blue',
            module: 'Invoicing',
          }, current),
    }));
    return invoice;
  }, [buildInvoiceFrom, pushNotification]);

  const updateInvoice = useCallback((id: string, input: InvoiceDraftInput) => {
    setState(current => ({
      ...current,
      invoices: current.invoices.map(invoice =>
        invoice.id === id ? buildInvoiceFrom(input, current, invoice) : invoice
      ),
    }));
  }, [buildInvoiceFrom]);

  const sendInvoice = useCallback((id: string) => {
    setState(current => {
      const target = current.invoices.find(i => i.id === id);
      if (!target || target.status !== 'draft') return current;
      const today = new Date().toISOString().slice(0, 10);
      const sent: Invoice = { ...target, status: 'sent', sentAt: today };
      return {
        ...current,
        invoices: current.invoices.map(i => (i.id === id ? { ...sent, status: deriveInvoiceStatus(sent) } : i)),
        notifications: pushNotification({
          title: `Invoice ${target.number} sent to ${target.customerCompany}`,
          body: `${formatNaira(target.amountDue)} due ${target.dueDate}.`,
          tone: 'blue',
          module: 'Invoicing',
        }, current),
      };
    });
  }, [pushNotification]);

  const recordInvoicePayment = useCallback((id: string, payment: RecordPaymentInput) => {
    setState(current => {
      const target = current.invoices.find(i => i.id === id);
      if (!target) return current;
      const entry: InvoicePayment = { ...payment, id: `pay-${Date.now()}` };
      const payments = [...target.payments, entry];
      const amountPaid = payments.reduce((a, p) => a + p.amount, 0);
      const totals = calcInvoiceTotals(target.lines, {
        vatRate: target.vatRate,
        whtRate: target.whtRate,
        amountPaid,
      });
      const updated: Invoice = { ...target, ...totals, payments };
      const status = deriveInvoiceStatus(updated);
      const settled: Invoice = {
        ...updated,
        status,
        paidAt: status === 'paid' ? payment.date : undefined,
      };
      return {
        ...current,
        invoices: current.invoices.map(i => (i.id === id ? settled : i)),
        notifications: status === 'paid'
          ? pushNotification({
              title: `Invoice ${target.number} paid in full`,
              body: `${formatNaira(amountPaid)} received from ${target.customerCompany}.`,
              tone: 'green',
              module: 'Invoicing',
            }, current)
          : pushNotification({
              title: `Part payment on ${target.number}`,
              body: `${formatNaira(payment.amount)} received; ${formatNaira(settled.balance)} outstanding.`,
              tone: 'amber',
              module: 'Invoicing',
            }, current),
      };
    });
  }, [pushNotification]);

  const cancelInvoice = useCallback((id: string) => {
    setState(current => ({
      ...current,
      invoices: current.invoices.map(i => (i.id === id ? { ...i, status: 'cancelled' as const } : i)),
    }));
  }, []);

  const deleteInvoice = useCallback((id: string) => {
    setState(current => ({
      ...current,
      // Only drafts are ever removed outright; issued invoices are cancelled instead.
      invoices: current.invoices.filter(i => !(i.id === id && i.status === 'draft')),
    }));
  }, []);

  // ----------------------------------------------------------------- payroll

  const createPayrollRun = useCallback((input: PayrollRunInput) => {
    // As with createInvoice: derive the run and its payslips from committed state so
    // the caller always receives the created record.
    const current = stateRef.current;
    const id = nextId('pr', current.payrollRuns);
    const roster = current.employees.filter(e => input.employeeIds.includes(e.id));
    const slips = roster.map(e =>
      buildPayslip(id, e, {
        bonus: input.adjustments?.[e.id]?.bonus ?? 0,
        otherDeductions: input.adjustments?.[e.id]?.otherDeductions ?? 0,
      })
    );
    const totals = summarisePayslips(slips);
    const periodDate = new Date(input.periodStart);
    const run: PayrollRun = {
      id,
      period: periodDate.toLocaleDateString('en-NG', { month: 'long', year: 'numeric' }),
      periodStart: input.periodStart,
      status: 'draft',
      payDate: input.payDate,
      employees: totals.employees,
      gross: totals.gross,
      deductions: totals.deductions,
      net: totals.net,
      paye: totals.paye,
      pension: totals.pension,
      nhf: totals.nhf,
      employerCost: totals.employerCost,
      currency: 'NGN',
      runBy: input.runBy || 'Fatima Ibrahim',
      createdAt: new Date().toISOString().slice(0, 10),
      note: input.note,
    };

    setState(cur => ({
      ...cur,
      payrollRuns: [run, ...cur.payrollRuns],
      payslips: [...slips, ...cur.payslips],
      notifications: pushNotification({
        title: `Payroll draft created for ${run.period}`,
        body: `${run.employees} employees • ${formatNaira(run.net)} net. Awaiting approval.`,
        tone: 'blue',
        module: 'Payroll',
      }, cur),
    }));
    return run;
  }, [pushNotification]);

  const approvePayrollRun = useCallback((id: string) => {
    setState(current => {
      const target = current.payrollRuns.find(r => r.id === id);
      if (!target || target.status !== 'draft') return current;
      return {
        ...current,
        payrollRuns: current.payrollRuns.map(r => r.id === id
          ? { ...r, status: 'approved' as const, approvedAt: new Date().toISOString().slice(0, 10) }
          : r),
        notifications: pushNotification({
          title: `Payroll for ${target.period} approved`,
          body: `${formatNaira(target.net)} cleared for disbursement on ${target.payDate}.`,
          tone: 'green',
          module: 'Payroll',
        }, current),
      };
    });
  }, [pushNotification]);

  const processPayrollRun = useCallback((id: string) => {
    setState(current => ({
      ...current,
      payrollRuns: current.payrollRuns.map(r =>
        r.id === id && r.status === 'approved' ? { ...r, status: 'processing' as const } : r
      ),
    }));
  }, []);

  const markPayrollRunPaid = useCallback((id: string) => {
    setState(current => {
      const target = current.payrollRuns.find(r => r.id === id);
      if (!target || (target.status !== 'processing' && target.status !== 'approved')) return current;
      const paidAt = new Date().toISOString().slice(0, 10);
      return {
        ...current,
        payrollRuns: current.payrollRuns.map(r => r.id === id
          ? { ...r, status: 'paid' as const, paidAt }
          : r),
        payslips: current.payslips.map(p => p.runId === id ? { ...p, status: 'paid' as const } : p),
        notifications: pushNotification({
          title: `Payroll for ${target.period} disbursed`,
          body: `${formatNaira(target.net)} paid to ${target.employees} employees. Payslips released.`,
          tone: 'green',
          module: 'Payroll',
        }, current),
      };
    });
  }, [pushNotification]);

  const deletePayrollRun = useCallback((id: string) => {
    setState(current => {
      const target = current.payrollRuns.find(r => r.id === id);
      // Only unapproved drafts can be discarded.
      if (!target || target.status !== 'draft') return current;
      return {
        ...current,
        payrollRuns: current.payrollRuns.filter(r => r.id !== id),
        payslips: current.payslips.filter(p => p.runId !== id),
      };
    });
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setState(current => ({
      ...current,
      notifications: current.notifications.map(notification => ({ ...notification, read: true })),
    }));
  }, []);

  const value = useMemo<MockDataContextValue>(() => ({
    ...state,
    setOnboardingDraft,
    resetOnboardingDraft,
    createEmployeeFromOnboarding,
    approveLeaveRequest,
    rejectLeaveRequest,
    createAsset,
    assignAssetToEmployee,
    markAllNotificationsRead,
    createInvoice,
    updateInvoice,
    sendInvoice,
    recordInvoicePayment,
    cancelInvoice,
    deleteInvoice,
    createPayrollRun,
    approvePayrollRun,
    processPayrollRun,
    markPayrollRunPaid,
    deletePayrollRun,
  }), [
    state,
    setOnboardingDraft,
    resetOnboardingDraft,
    createEmployeeFromOnboarding,
    approveLeaveRequest,
    rejectLeaveRequest,
    createAsset,
    assignAssetToEmployee,
    markAllNotificationsRead,
    createInvoice,
    updateInvoice,
    sendInvoice,
    recordInvoicePayment,
    cancelInvoice,
    deleteInvoice,
    createPayrollRun,
    approvePayrollRun,
    processPayrollRun,
    markPayrollRunPaid,
    deletePayrollRun,
  ]);

  return <MockDataContext.Provider value={value}>{children}</MockDataContext.Provider>;
}

export function useMockData() {
  const value = useContext(MockDataContext);
  if (!value) throw new Error('useMockData must be used within MockDataProvider');
  return value;
}
