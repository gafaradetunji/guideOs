import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  assets as seedAssets,
  employees as seedEmployees,
  leaveRequests as seedLeaveRequests,
  type Asset,
  type Employee,
  type LeaveRequest,
} from '../data/seed';

const STORAGE_KEY = 'guideos-mock-state-v1';

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

interface MockDataContextValue extends MockState {
  setOnboardingDraft: (draft: OnboardingDraft) => void;
  resetOnboardingDraft: () => void;
  createEmployeeFromOnboarding: (input: CreateEmployeeInput) => Employee;
  approveLeaveRequest: (id: string) => void;
  rejectLeaveRequest: (id: string) => void;
  createAsset: (input: CreateAssetInput) => Asset;
  assignAssetToEmployee: (assetId: string, employeeId: string) => void;
  markAllNotificationsRead: () => void;
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

function nextId(prefix: string, items: { id: string }[]) {
  const max = items.reduce((acc, item) => {
    const value = Number(item.id.replace(/^[^-]+-/, ''));
    return Number.isFinite(value) ? Math.max(acc, value) : acc;
  }, 0);
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
}

export function MockDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<MockState>(() => getStoredState());

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const setOnboardingDraft = useCallback((draft: OnboardingDraft) => {
    setState(current => ({ ...current, onboardingDraft: draft }));
  }, []);

  const resetOnboardingDraft = useCallback(() => {
    setState(current => ({ ...current, onboardingDraft: defaultOnboardingDraft }));
  }, []);

  const createEmployeeFromOnboarding = useCallback((input: CreateEmployeeInput) => {
    let createdEmployee: Employee | null = null;
    setState(current => {
      const manager = current.employees.find(employee => employee.id === input.managerId);
      const salary = Number(input.annualSalary) || 0;
      const id = nextId('e', current.employees);
      createdEmployee = {
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
        currency: 'USD',
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

      return {
        ...current,
        employees: [createdEmployee, ...current.employees],
        notifications: [
          {
            id: `n-${String(current.notifications.length + 1).padStart(3, '0')}`,
            title: `New hire created: ${createdEmployee.firstName} ${createdEmployee.lastName}`,
            body: `${createdEmployee.jobTitle} added to ${manager ? manager.firstName + "'s" : 'the'} reporting line and onboarding checklist started.`,
            time: 'just now',
            tone: 'green',
            module: 'Onboarding',
            read: false,
          },
          ...current.notifications,
        ],
        onboardingDraft: defaultOnboardingDraft,
      };
    });

    if (!createdEmployee) throw new Error('Failed to create employee');
    return createdEmployee;
  }, []);

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
    let createdAsset: Asset | null = null;
    setState(current => {
      createdAsset = {
        id: nextId('a', current.assets),
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

      return {
        ...current,
        assets: [createdAsset, ...current.assets],
      };
    });

    if (!createdAsset) throw new Error('Failed to create asset');
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
  ]);

  return <MockDataContext.Provider value={value}>{children}</MockDataContext.Provider>;
}

export function useMockData() {
  const value = useContext(MockDataContext);
  if (!value) throw new Error('useMockData must be used within MockDataProvider');
  return value;
}
