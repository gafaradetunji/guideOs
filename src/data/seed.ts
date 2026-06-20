// Mock domain data for GuideOS — realistic enough to drive tables, drawers, wizards, and dashboards.

export type ID = string;

export interface Employee {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  jobTitle: string;
  departmentId: ID;
  teamIds: ID[];
  managerId?: ID;
  status: 'active' | 'on_leave' | 'probation' | 'inactive';
  employmentType: 'full_time' | 'contractor' | 'intern' | 'part_time';
  startDate: string;
  endDate?: string;
  location: string;
  country: string;
  salary: number;
  currency: string;
  bankName?: string;
  accountNumber?: string;
  taxId?: string;
  pensionId?: string;
  nhfId?: string;
  tin?: string;
  level: string;
  pronouns?: string;
  birthDate?: string;
  emergencyContact?: { name: string; phone: string; relationship: string };
  address?: string;
  onboardingProgress?: number;
}

export interface Department {
  id: ID;
  name: string;
  leadId: ID;
  headcount: number;
  parentDepartmentId?: ID;
  color: string;
  description: string;
}

export interface Team {
  id: ID;
  name: string;
  departmentId: ID;
  leadId: ID;
}

export interface Lead {
  id: ID;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified';
  source: string;
  owner: string;
  value: number;
  createdAt: string;
  lastActivityAt: string;
}

export interface Opportunity {
  id: ID;
  name: string;
  company: string;
  value: number;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  probability: number;
  owner: string;
  closeDate: string;
  contactName: string;
  type: 'new_business' | 'renewal' | 'expansion';
}

export interface Customer {
  id: ID;
  name: string;
  company: string;
  email: string;
  plan: 'free' | 'starter' | 'growth' | 'enterprise';
  mrr: number;
  status: 'active' | 'churned' | 'past_due';
  owner: string;
  signupDate: string;
  country: string;
}

export interface PayrollRun {
  id: ID;
  period: string;
  status: 'draft' | 'approved' | 'processing' | 'paid' | 'failed';
  payDate: string;
  employees: number;
  gross: number;
  deductions: number;
  net: number;
  currency: string;
  runBy: string;
  createdAt: string;
}

export interface Asset {
  id: ID;
  name: string;
  type: 'laptop' | 'phone' | 'monitor' | 'accessory' | 'software' | 'peripheral';
  brand: string;
  model: string;
  serial: string;
  status: 'available' | 'assigned' | 'in_repair' | 'retired';
  assigneeId?: ID;
  assignedAt?: string;
  purchaseDate: string;
  purchaseValue: number;
  location: string;
}

export interface LeaveRequest {
  id: ID;
  employeeId: ID;
  type: 'annual' | 'sick' | 'compassionate' | 'maternity' | 'paternity' | 'unpaid';
  startDate: string;
  endDate: string;
  days: number;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reason: string;
  approverId?: ID;
  approvedAt?: string;
  createdAt: string;
}

export interface Ticket {
  id: ID;
  subject: string;
  requester: string;
  requesterEmail: string;
  status: 'open' | 'pending' | 'on_hold' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  assignee?: string;
  channel: 'email' | 'chat' | 'portal' | 'phone';
  createdAt: string;
  updatedAt: string;
  sla: 'met' | 'at_risk' | 'breached';
}

export interface KbArticle {
  id: ID;
  title: string;
  category: 'payroll' | 'hr' | 'crm' | 'finance' | 'it' | 'policies';
  author: string;
  status: 'published' | 'draft' | 'review';
  views: number;
  helpful: number;
  updatedAt: string;
  summary: string;
  tags: string[];
}

export interface Task {
  id: ID;
  title: string;
  board: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  assignee: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  tags: string[];
}

export interface Activity {
  id: ID;
  actor: string;
  action: string;
  target: string;
  module: string;
  timestamp: string;
  type: 'create' | 'update' | 'delete' | 'approve' | 'comment' | 'login' | 'assign';
}

export interface Candidate {
  id: ID;
  name: string;
  email: string;
  phone: string;
  positionId: ID;
  stage: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  source: string;
  rating: number;
  owner: string;
  appliedAt: string;
  location: string;
}

export interface Position {
  id: ID;
  title: string;
  departmentId: ID;
  status: 'open' | 'on_hold' | 'closed';
  type: 'full_time' | 'contract' | 'intern';
  location: string;
  applicants: number;
  salaryRange: string;
  hiringManager: string;
  openedAt: string;
}

export interface Expense {
  id: ID;
  employeeId: ID;
  category: string;
  amount: number;
  currency: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'paid';
  date: string;
  vendor: string;
  description: string;
  receiptName?: string;
}

export interface ComplianceItem {
  id: ID;
  type: 'paye' | 'pension' | 'nhf' | 'nsitf' | 'itf';
  period: string;
  amount: number;
  status: 'pending' | 'filed' | 'paid' | 'overdue';
  dueDate: string;
  filedDate?: string;
}

export const departments: Department[] = [
  { id: 'd-eng', name: 'Engineering', leadId: 'e-001', headcount: 38, color: '#3463ff', description: 'Builds and maintains all software products.' },
  { id: 'd-prod', name: 'Product', leadId: 'e-007', headcount: 9, color: '#e84a18', description: 'Owns product vision and roadmap.' },
  { id: 'd-design', name: 'Design', leadId: 'e-012', headcount: 6, color: '#7c3aed', description: 'Design systems, research, and brand.' },
  { id: 'd-sales', name: 'Sales', leadId: 'e-019', headcount: 14, color: '#0ea5e9', description: 'Revenue generation and partnerships.' },
  { id: 'd-mktg', name: 'Marketing', leadId: 'e-024', headcount: 8, color: '#10b981', description: 'Demand gen, content, lifecycle.' },
  { id: 'd-people', name: 'People', leadId: 'e-029', headcount: 6, color: '#f59e0b', description: 'HR, recruiting, and culture.' },
  { id: 'd-finance', name: 'Finance', leadId: 'e-034', headcount: 7, color: '#ec4899', description: 'Accounting, payroll, FP&A.' },
  { id: 'd-support', name: 'Customer Success', leadId: 'e-039', headcount: 11, color: '#6366f1', description: 'Onboarding, support, renewals.' },
  { id: 'd-legal', name: 'Legal & Compliance', leadId: 'e-042', headcount: 4, color: '#64748b', description: 'Contracts, regulatory, IP.' },
  { id: 'd-ops', name: 'Operations', leadId: 'e-046', headcount: 5, color: '#14b8a6', description: 'IT, office, vendor management.' },
];

export const teams: Team[] = [
  { id: 't-fe', name: 'Frontend', departmentId: 'd-eng', leadId: 'e-002' },
  { id: 't-be', name: 'Backend', departmentId: 'd-eng', leadId: 'e-003' },
  { id: 't-infra', name: 'Platform', departmentId: 'd-eng', leadId: 'e-004' },
  { id: 't-data', name: 'Data', departmentId: 'd-eng', leadId: 'e-005' },
  { id: 't-mobile', name: 'Mobile', departmentId: 'd-eng', leadId: 'e-006' },
  { id: 't-pm', name: 'Product Mgmt', departmentId: 'd-prod', leadId: 'e-008' },
  { id: 't-research', name: 'UX Research', departmentId: 'd-design', leadId: 'e-013' },
  { id: 't-aes', name: 'AE Team', departmentId: 'd-sales', leadId: 'e-020' },
  { id: 't-sdr', name: 'SDR Team', departmentId: 'd-sales', leadId: 'e-021' },
  { id: 't-content', name: 'Content', departmentId: 'd-mktg', leadId: 'e-025' },
];

const firstNames = ['Adaobi','Tunde','Chiamaka','Ibrahim','Zainab','Emeka','Fatima','Olumide','Aisha','Kunle','Ngozi','Yusuf','Bisi','Chidi','Hauwa','Dami','Sade','Tobi','Funmi','Bayo','Rita','Gbolahan','Yetunde','Femi','Ifeoma','Seyi','Hadiza','Nnamdi','Bukola','Kelechi','Mariam','Ola','Tola','Wale','Nneka','Tope','Kemi','Jide','Sandra','Paul','Grace','Mike','Ade','Chi'];
const lastNames = ['Okoye','Adeyemi','Okafor','Bello','Eze','Olawale','Mohammed','Adebayo','Ibrahim','Nwosu','Ojo','Sani','Okafor','Adeleke','Musa','Ogunleye','Nwankwo','Oyelaran','Dauda','Abe','Okafor','Adewale','Ibrahim','Oluwafemi','Ezewu'];
const jobTitles = [
  'Staff Engineer','Senior Product Manager','Engineering Manager','Senior Designer','Account Executive','Account Manager','Customer Success Manager','Senior Backend Engineer','Senior Frontend Engineer','Data Scientist','Site Reliability Engineer','Head of People','Payroll Specialist','FP&A Analyst','Legal Counsel','IT Administrator','SDR Team Lead','Senior Account Executive','Content Strategist','UX Researcher','Mobile Engineer','Platform Engineer','Junior Designer','Head of Marketing','Compliance Officer','Talent Partner','Tax Accountant','Technical Recruiter','Office Manager','HR Business Partner',
];
const cities = ['Lagos','Abuja','Nairobi','Accra','London','Toronto','Dubai','Cape Town','Kigali','New York'];
const countries = ['Nigeria','Kenya','Ghana','UK','Canada','UAE','South Africa','Rwanda','USA'];

const departments2 = departments;
function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().slice(0,10);
}

export const employees: Employee[] = Array.from({ length: 68 }).map((_, i) => {
  const fn = firstNames[i % firstNames.length];
  const ln = lastNames[i % lastNames.length];
  const dept = departments2[i % departments2.length];
  const titles = jobTitles;
  const status = i % 9 === 0 ? 'on_leave' : (i % 14 === 0 ? 'probation' : (i % 30 === 0 ? 'inactive' : 'active'));
  const type = i % 11 === 0 ? 'contractor' : (i % 17 === 0 ? 'part_time' : 'full_time');
  return {
    id: `e-${String(i + 1).padStart(3, '0')}`,
    firstName: fn,
    lastName: ln,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@nerithonx.com`,
    phone: `+234 80${i % 9} ${100 + i} ${(1000 + i * 7).toString().slice(0,4)}`,
    jobTitle: titles[i % titles.length],
    departmentId: dept.id,
    teamIds: teams.filter(t => t.departmentId === dept.id).slice(0, 1).map(t => t.id),
    managerId: i === 0 ? undefined : (i < 10 ? `e-001` : `e-${String(Math.floor(i/5)).padStart(3,'0') || '001'}`),
    status,
    employmentType: type,
    startDate: randomDate(new Date(2019, 0, 1), new Date(2025, 4, 1)),
    location: cities[i % cities.length],
    country: countries[i % countries.length],
    salary: 40000 + (i * 2371) % 200000,
    currency: 'USD',
    bankName: ['GTBank','Access Bank','Zenith Bank','First Bank','UBA','Kuda','Stanbic'][i % 7],
    accountNumber: `${1000000000 + i * 12345}`,
    taxId: `TIN-${100000 + i * 17}`,
    pensionId: `PFA-${200000 + i * 19}`,
    nhfId: `NHF-${300000 + i * 13}`,
    tin: `${12345678 + i}-0000`,
    level: ['L1','L2','L3','L4','L5','L6','L7','L8'][i % 8],
    pronouns: i % 2 ? 'she/her' : 'he/him',
    birthDate: randomDate(new Date(1980, 0, 1), new Date(2000, 11, 31)),
    emergencyContact: { name: `${firstNames[(i+3) % firstNames.length]} ${lastNames[(i+5) % lastNames.length]}`, phone: `+234 803 ${100+i} ${(2000+i*3).toString().slice(0,4)}`, relationship: ['Spouse','Parent','Sibling'][i%3] },
    address: `${10+i} Adeola Odeku Street, Victoria Island, ${cities[i % cities.length]}`,
    onboardingProgress: status === 'probation' ? 60 + (i % 4) * 10 : 100,
  };
});

// Make e-001 the CEO
employees[0] = {
  ...employees[0],
  firstName: 'Nerithon',
  lastName: 'Founder',
  jobTitle: 'Chief Executive Officer',
  departmentId: 'd-ops',
  managerId: undefined,
  status: 'active',
  level: 'L8',
  salary: 320000,
};

export const leads: Lead[] = Array.from({ length: 32 }).map((_, i) => ({
  id: `l-${String(i+1).padStart(3,'0')}`,
  name: firstNames[i % firstNames.length] + ' ' + lastNames[i % lastNames.length],
  company: ['Acme Corp','Beta Industries','Gamma Holdings','Delta Tech','Epsilon Labs','Zeta Group','Eta Systems','Theta Capital','Iota Energy','Kappa Health'][i % 10],
  email: `lead${i+1}@example.com`,
  phone: `+234 80${i%9} ${200+i} ${(3000+i*5).toString().slice(0,4)}`,
  status: ['new','contacted','qualified','unqualified'][i % 4] as any,
  source: ['Website','Referral','LinkedIn','Cold Email','Trade Show','Webinar'][i % 6],
  owner: `${firstNames[i%firstNames.length]} ${lastNames[i%lastNames.length]}`,
  value: 5000 + (i * 3137) % 50000,
  createdAt: randomDate(new Date(2025, 0, 1), new Date(2025, 5, 1)),
  lastActivityAt: randomDate(new Date(2025, 5, 1), new Date(2025, 6, 1)),
}));

export const opportunities: Opportunity[] = Array.from({ length: 22 }).map((_, i) => ({
  id: `o-${String(i+1).padStart(3,'0')}`,
  name: ['GuideOS Enterprise','Annual Renewal','Expansion - APAC','Platform License','Add-on Seats','Strategic Partnership','Multi-year Deal','Pro Services','Compliance Module','Onboarding Package'][i % 10],
  company: ['Acme Corp','Beta Industries','Gamma Holdings','Delta Tech','Epsilon Labs','Zeta Group','Eta Systems','Theta Capital','Iota Energy','Kappa Health'][i % 10],
  value: 12000 + (i * 8473) % 180000,
  stage: ['prospecting','qualification','proposal','negotiation','closed_won','closed_lost'][i % 6] as any,
  probability: [10,25,50,75,100,0][i % 6],
  owner: `${firstNames[(i+5)%firstNames.length]} ${lastNames[(i+3)%lastNames.length]}`,
  closeDate: randomDate(new Date(2025, 6, 1), new Date(2025, 11, 31)),
  contactName: `${firstNames[i%firstNames.length]} ${lastNames[(i+2)%lastNames.length]}`,
  type: ['new_business','renewal','expansion'][i % 3] as any,
}));

export const customers: Customer[] = Array.from({ length: 28 }).map((_, i) => ({
  id: `c-${String(i+1).padStart(3,'0')}`,
  name: `${firstNames[i%firstNames.length]} ${lastNames[i%lastNames.length]}`,
  company: ['Acme Corp','Beta Industries','Gamma Holdings','Delta Tech','Epsilon Labs','Zeta Group','Eta Systems','Theta Capital','Iota Energy','Kappa Health','Lambda Media','Mu Logistics'][i % 12],
  email: `contact${i+1}@${['acme','beta','gamma','delta','epsilon','zeta','eta','theta','iota','kappa'][i%10]}.com`,
  plan: ['free','starter','growth','enterprise'][i % 4] as any,
  mrr: [0, 499, 2499, 9900][i % 4],
  status: i % 9 === 0 ? 'past_due' : (i % 13 === 0 ? 'churned' : 'active'),
  owner: `${firstNames[(i+2)%firstNames.length]} ${lastNames[(i+4)%lastNames.length]}`,
  signupDate: randomDate(new Date(2022, 0, 1), new Date(2025, 4, 1)),
  country: countries[i % countries.length],
}));

export const payrollRuns: PayrollRun[] = Array.from({ length: 8 }).map((_, i) => {
  const month = new Date(2025, 11 - i, 1);
  const period = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const empCount = 60 + (i % 5) * 2;
  const gross = empCount * 8421;
  return {
    id: `pr-${String(i+1).padStart(3,'0')}`,
    period,
    status: i === 0 ? 'draft' : (i === 1 ? 'approved' : (i === 2 ? 'processing' : 'paid')) as any,
    payDate: new Date(month.getFullYear(), month.getMonth() + 1, 28).toISOString().slice(0, 10),
    employees: empCount,
    gross,
    deductions: gross * 0.18,
    net: gross * 0.82,
    currency: 'USD',
    runBy: 'Fatima Ibrahim',
    createdAt: new Date(month.getFullYear(), month.getMonth(), 15).toISOString().slice(0, 10),
  };
});

export const assets: Asset[] = Array.from({ length: 40 }).map((_, i) => {
  const types: Asset['type'][] = ['laptop','phone','monitor','accessory','software','peripheral'];
  const type = types[i % types.length];
  const brands = type === 'laptop' ? ['Apple','Dell','Lenovo','HP'] : type === 'phone' ? ['Apple','Samsung','Google'] : type === 'monitor' ? ['LG','Dell','Samsung'] : type === 'software' ? ['Atlassian','Figma','GitHub','Slack'] : ['Logitech','Anker','Microsoft'];
  return {
    id: `a-${String(i+1).padStart(3,'0')}`,
    name: `${brands[i % brands.length]} ${['MacBook Pro 14"','XPS 15','ThinkPad X1','EliteBook 840','iPhone 15','Galaxy S24','UltraFine 27"','MX Master 3S','Mechanical Keyboard','Jira Cloud','Figma Pro'][i%10]}`,
    type,
    brand: brands[i % brands.length],
    model: `M${2023 + (i%3)}-${1000+i}`,
    serial: `SN${100000 + i * 137}`,
    status: i % 7 === 0 ? 'available' : (i % 9 === 0 ? 'in_repair' : (i % 13 === 0 ? 'retired' : 'assigned')),
    assigneeId: i % 7 === 0 || i % 9 === 0 || i % 13 === 0 ? undefined : employees[i % employees.length].id,
    assignedAt: i % 7 === 0 ? undefined : randomDate(new Date(2023, 0, 1), new Date(2025, 4, 1)),
    purchaseDate: randomDate(new Date(2021, 0, 1), new Date(2025, 3, 1)),
    purchaseValue: 200 + (i * 387) % 4500,
    location: ['HQ - Lagos','Remote','Abuja Office','London Office'][i % 4],
  };
});

export const leaveRequests: LeaveRequest[] = Array.from({ length: 24 }).map((_, i) => {
  const emp = employees[i % employees.length];
  return {
    id: `lv-${String(i+1).padStart(3,'0')}`,
    employeeId: emp.id,
    type: ['annual','sick','compassionate','maternity','paternity','unpaid'][i % 6] as any,
    startDate: randomDate(new Date(2025, 5, 1), new Date(2025, 11, 1)),
    endDate: randomDate(new Date(2025, 5, 5), new Date(2025, 11, 10)),
    days: 1 + (i % 14),
    status: ['pending','approved','rejected','cancelled'][i % 4] as any,
    reason: ['Family event','Medical appointment','Personal matter','Vacation','Bereavement','Conference'][i % 6],
    approverId: `e-029`,
    approvedAt: i % 2 ? randomDate(new Date(2025, 4, 1), new Date(2025, 5, 15)) : undefined,
    createdAt: randomDate(new Date(2025, 4, 1), new Date(2025, 5, 15)),
  };
});

export const tickets: Ticket[] = Array.from({ length: 36 }).map((_, i) => ({
  id: `tk-${String(i+1).padStart(4,'0')}`,
  subject: ['Cannot log in to GuideOS','Payroll shows wrong amount','Need access to CRM module','Onboarding checklist stuck','Expense reimbursement delay','How to add new employee?','Payslip download not working','Slack integration broken','Two-factor auth issue','Asset assignment error'][i % 10],
  requester: `${firstNames[(i+3)%firstNames.length]} ${lastNames[(i+5)%lastNames.length]}`,
  requesterEmail: `user${i+1}@company.com`,
  status: ['open','pending','on_hold','resolved','closed'][i % 5] as any,
  priority: ['low','medium','high','urgent'][i % 4] as any,
  category: ['Access','Payroll','CRM','Onboarding','Finance','IT'][i % 6],
  assignee: i % 3 === 0 ? undefined : `${firstNames[(i+1)%firstNames.length]} ${lastNames[(i+2)%lastNames.length]}`,
  channel: ['email','chat','portal','phone'][i % 4] as any,
  createdAt: randomDate(new Date(2025, 5, 1), new Date(2025, 6, 1)),
  updatedAt: randomDate(new Date(2025, 6, 1), new Date(2025, 6, 20)),
  sla: i % 6 === 0 ? 'breached' : (i % 3 === 0 ? 'at_risk' : 'met') as any,
}));

export const articles: KbArticle[] = Array.from({ length: 40 }).map((_, i) => ({
  id: `kb-${String(i+1).padStart(3,'0')}`,
  title: [
    'How to run monthly payroll in GuideOS','Adding a new employee: complete walkthrough','Understanding Nigerian PAYE calculations','Setting up your CRM pipeline stages','Configuring asset assignments','Approval workflows for leave requests','Reimbursing employee expenses','Integrating Slack with GuideOS','Onboarding checklist explained','Exporting payroll reports for tax filing'
  ][i % 10] + (i >= 10 ? ` (Part ${Math.floor(i/10)+1})` : ''),
  category: ['payroll','hr','crm','finance','it','policies'][i % 6] as any,
  author: `${firstNames[(i+1)%firstNames.length]} ${lastNames[(i+3)%lastNames.length]}`,
  status: i % 7 === 0 ? 'draft' : (i % 5 === 0 ? 'review' : 'published') as any,
  views: 50 + (i * 137) % 4000,
  helpful: 80 + (i * 11) % 19,
  updatedAt: randomDate(new Date(2025, 3, 1), new Date(2025, 6, 1)),
  summary: 'Comprehensive guide for this workflow in GuideOS, including steps, prerequisites, and troubleshooting tips for administrators and end users.',
  tags: [['payroll','monthly'],['employee','onboarding'],['tax','nigeria'],['crm','pipeline'],['assets','assign'],['leave','approval'],['expense','reimburse'],['slack','integration'],['onboarding','checklist'],['reports','tax']][i%10],
}));

export const projects: { id: string; name: string; board: string; tasks: Task[] }[] = [];
const boardNames = ['Product Roadmap Q3','Sales Enablement','HR Transformation','Compliance Migration','GuideAI Training'];
const taskTitles = ['Draft PRD','Review with stakeholders','Finalize scope','Kickoff meeting','Prepare demo','User testing','Ship to staging','Close out sprint'];
boardNames.forEach((b, bi) => {
  const tasks: Task[] = Array.from({ length: 8 }).map((_, ti) => ({
    id: `tsk-${bi}-${ti+1}`,
    title: taskTitles[ti % taskTitles.length],
    board: b,
    status: (['todo','todo','in_progress','in_progress','review','review','done','done'][ti % 8]) as any,
    assignee: `${firstNames[(ti+bi)%firstNames.length]} ${lastNames[(ti+2)%lastNames.length]}`,
    priority: (['low','medium','high','urgent'][ti % 4]) as any,
    dueDate: randomDate(new Date(2025, 6, 1), new Date(2025, 9, 30)),
    tags: [['roadmap','product'],['enablement','sales'],['transform','hr'],['compliance','tax']][bi%4],
  }));
  projects.push({ id: `b-${bi+1}`, name: b, board: b, tasks });
});

export const activities: Activity[] = Array.from({ length: 50 }).map((_, i) => {
  const verbs = [
    { a: 'approved', t: 'leave request', type: 'approve' as const },
    { a: 'created', t: 'payroll run', type: 'create' as const },
    { a: 'updated', t: 'employee record', type: 'update' as const },
    { a: 'assigned', t: 'MacBook Pro 14"', type: 'assign' as const },
    { a: 'commented on', t: 'ticket #0042', type: 'comment' as const },
    { a: 'signed in', t: '', type: 'login' as const },
    { a: 'created', t: 'opportunity "GuideOS Enterprise"', type: 'create' as const },
    { a: 'closed', t: 'compliance item PAYE', type: 'update' as const },
  ][i % 8];
  return {
    id: `ac-${String(i+1).padStart(3,'0')}`,
    actor: `${firstNames[i%firstNames.length]} ${lastNames[(i+3)%lastNames.length]}`,
    action: verbs.a,
    target: verbs.t ? `${firstNames[(i+5)%firstNames.length]} ${lastNames[(i+1)%lastNames.length]}'s ${verbs.t}` : 'from Lagos, NG',
    module: ['People','Payroll','CRM','Assets','Support','Finance'][i % 6],
    timestamp: new Date(Date.now() - i * 1000 * 60 * 37).toISOString(),
    type: verbs.type,
  };
});

export const candidates: Candidate[] = Array.from({ length: 24 }).map((_, i) => ({
  id: `cd-${String(i+1).padStart(3,'0')}`,
  name: `${firstNames[(i+2)%firstNames.length]} ${lastNames[(i+1)%lastNames.length]}`,
  email: `candidate${i+1}@email.com`,
  phone: `+234 80${i%9} ${300+i} ${(4000+i*3).toString().slice(0,4)}`,
  positionId: `p-${(i%8)+1}`,
  stage: ['applied','screening','interview','offer','hired','rejected'][i % 6] as any,
  source: ['LinkedIn','Referral','Job Board','Careers Page','Headhunter','Indeed'][i % 6],
  rating: 2 + (i % 4),
  owner: `${firstNames[(i+4)%firstNames.length]} ${lastNames[(i+2)%lastNames.length]}`,
  appliedAt: randomDate(new Date(2025, 4, 1), new Date(2025, 6, 1)),
  location: cities[i % cities.length],
}));

export const positions: Position[] = Array.from({ length: 8 }).map((_, i) => ({
  id: `p-${i+1}`,
  title: ['Senior Backend Engineer','Product Designer','Account Executive','Engineering Manager','Data Scientist','Senior Frontend Engineer','Customer Success Manager','Compliance Analyst'][i],
  departmentId: departments[i % departments.length].id,
  status: i % 5 === 0 ? 'on_hold' : (i % 7 === 0 ? 'closed' : 'open') as any,
  type: ['full_time','full_time','full_time','full_time','full_time','full_time','full_time','contract'][i] as any,
  location: ['Lagos','Remote - Nigeria','Remote - Global','Abuja','London'][i % 5],
  applicants: 8 + (i * 5) % 40,
  salaryRange: ['$90-120k','$100-130k','$80-110k','$140-180k','$110-140k','$95-125k','$90-115k','$70-90k'][i],
  hiringManager: `${firstNames[i%firstNames.length]} ${lastNames[(i+3)%lastNames.length]}`,
  openedAt: randomDate(new Date(2025, 0, 1), new Date(2025, 5, 1)),
}));

export const expenses: Expense[] = Array.from({ length: 28 }).map((_, i) => ({
  id: `exp-${String(i+1).padStart(3,'0')}`,
  employeeId: employees[i % employees.length].id,
  category: ['Travel','Meals','Software','Office Supplies','Client Entertainment','Hardware','Training','Phone'][i % 8],
  amount: 25 + (i * 137) % 2800,
  currency: 'USD',
  status: ['draft','submitted','approved','rejected','paid'][i % 5] as any,
  date: randomDate(new Date(2025, 4, 1), new Date(2025, 6, 1)),
  vendor: ['Uber','DoorDash','Adobe','Amazon','Stripes Restaurant','Best Buy','Udemy','Verizon'][i % 8],
  description: 'Business expense incurred during normal operations.',
  receiptName: i % 4 === 0 ? undefined : `receipt_${i+1}.pdf`,
}));

export const complianceItems: ComplianceItem[] = Array.from({ length: 20 }).map((_, i) => {
  const types: ComplianceItem['type'][] = ['paye','pension','nhf','nsitf','itf'];
  const months = ['April 2025','May 2025','June 2025','July 2025'];
  return {
    id: `cm-${String(i+1).padStart(3,'0')}`,
    type: types[i % 5],
    period: months[i % 4],
    amount: 4000 + (i * 1231) % 23000,
    status: i % 4 === 0 ? 'overdue' : (i % 3 === 0 ? 'pending' : (i % 5 === 0 ? 'filed' : 'paid')) as any,
    dueDate: randomDate(new Date(2025, 5, 1), new Date(2025, 8, 1)),
    filedDate: i % 5 === 0 ? randomDate(new Date(2025, 4, 1), new Date(2025, 5, 28)) : undefined,
  };
});

export function formatCurrency(n: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

export function fullName(e: { firstName: string; lastName: string }) {
  return `${e.firstName} ${e.lastName}`;
}

export function getEmployee(id?: ID) {
  if (!id) return undefined;
  return employees.find(e => e.id === id);
}

export function getDepartment(id?: ID) {
  if (!id) return undefined;
  return departments.find(d => d.id === id);
}

// Onboarding checklist template — shared between wizard and checklist views
export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  required: boolean;
  module: string;
}

export const onboardingSteps: OnboardingStep[] = [
  { id: 'offer_signed', title: 'Offer Letter Signed', description: 'Counter-signed offer letter returned by candidate.', required: true, module: 'Recruitment' },
  { id: 'create_account', title: 'Create Account', description: 'Provision GuideOS account with appropriate role.', required: true, module: 'IT' },
  { id: 'assign_department', title: 'Assign Department & Team', description: 'Place employee into the correct org structure.', required: true, module: 'People' },
  { id: 'assign_manager', title: 'Assign Manager', description: 'Set reporting manager for approvals and 1:1s.', required: true, module: 'People' },
  { id: 'welcome_email', title: 'Send Welcome Email', description: 'Day-one welcome email with handbook and first-week schedule.', required: true, module: 'People' },
  { id: 'assign_equipment', title: 'Assign Equipment', description: 'Provision laptop, phone, and accessories.', required: true, module: 'Assets' },
  { id: 'training_materials', title: 'Training Materials', description: 'Assign role-based training paths in the Learning module.', required: true, module: 'Learning' },
  { id: 'compliance_forms', title: 'Compliance Forms', description: 'Collect PAYE, pension, NHF, NSITF enrollment forms.', required: true, module: 'Compliance' },
  { id: 'complete', title: 'Onboarding Complete', description: 'Mark onboarding as complete and remove probation flag (optional).', required: false, module: 'People' },
];
