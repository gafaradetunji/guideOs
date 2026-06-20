import { type ReactNode } from 'react';
import {
  LayoutDashboard, Activity, Bell, Users, Building2, Network, UserPlus,
  DollarSign, CalendarDays, Clock, Laptop, Receipt, ShieldCheck, BookOpen,
  LifeBuoy, KanbanSquare, BarChart3, Zap, Plug, Settings, Briefcase,
  Handshake, FileText, CheckSquare,
} from 'lucide-react';

export interface NavSection {
  id: string;
  label: string;
  icon: ReactNode;
  items: NavItem[];
}

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon?: ReactNode;
  badge?: number;
}

export const navSections: NavSection[] = [
  {
    id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" />,
    items: [
      { id: 'overview', label: 'Overview', path: '/', icon: <LayoutDashboard className="h-4 w-4" /> },
      { id: 'activity', label: 'Activity Feed', path: '/activity', icon: <Activity className="h-4 w-4" /> },
      { id: 'notifications', label: 'Notifications', path: '/notifications', icon: <Bell className="h-4 w-4" />, badge: 7 },
    ],
  },
  {
    id: 'crm', label: 'CRM', icon: <Handshake className="h-4 w-4" />,
    items: [
      { id: 'leads', label: 'Leads', path: '/crm/leads', icon: <UserPlus className="h-4 w-4" /> },
      { id: 'contacts', label: 'Contacts', path: '/crm/contacts', icon: <Users className="h-4 w-4" /> },
      { id: 'companies', label: 'Companies', path: '/crm/companies', icon: <Building2 className="h-4 w-4" /> },
      { id: 'opportunities', label: 'Opportunities', path: '/crm/opportunities', icon: <Briefcase className="h-4 w-4" /> },
      { id: 'pipelines', label: 'Pipelines', path: '/crm/pipelines', icon: <Network className="h-4 w-4" /> },
    ],
  },
  {
    id: 'customers', label: 'Customers', icon: <Users className="h-4 w-4" />,
    items: [
      { id: 'customers', label: 'Customer List', path: '/customers', icon: <Users className="h-4 w-4" /> },
      { id: 'contracts', label: 'Contracts', path: '/customers/contracts', icon: <FileText className="h-4 w-4" /> },
      { id: 'invoices', label: 'Invoices', path: '/customers/invoices', icon: <Receipt className="h-4 w-4" /> },
    ],
  },
  {
    id: 'employees', label: 'Employees', icon: <Users className="h-4 w-4" />,
    items: [
      { id: 'directory', label: 'Employee Directory', path: '/employees', icon: <Users className="h-4 w-4" /> },
      { id: 'departments', label: 'Departments', path: '/employees/departments', icon: <Building2 className="h-4 w-4" /> },
      { id: 'org-chart', label: 'Org Chart', path: '/employees/org-chart', icon: <Network className="h-4 w-4" /> },
    ],
  },
  {
    id: 'recruitment', label: 'Recruitment', icon: <UserPlus className="h-4 w-4" />,
    items: [
      { id: 'candidates', label: 'Candidates', path: '/recruitment/candidates', icon: <Users className="h-4 w-4" /> },
      { id: 'positions', label: 'Job Positions', path: '/recruitment/positions', icon: <Briefcase className="h-4 w-4" /> },
    ],
  },
  {
    id: 'onboarding', label: 'Onboarding', icon: <CheckSquare className="h-4 w-4" />,
    items: [
      { id: 'checklist', label: 'New Hire Checklist', path: '/onboarding', icon: <CheckSquare className="h-4 w-4" />, badge: 3 },
      { id: 'wizard', label: 'Start Onboarding', path: '/onboarding/wizard', icon: <UserPlus className="h-4 w-4" /> },
    ],
  },
  {
    id: 'payroll', label: 'Payroll', icon: <DollarSign className="h-4 w-4" />,
    items: [
      { id: 'runs', label: 'Payroll Runs', path: '/payroll', icon: <DollarSign className="h-4 w-4" /> },
      { id: 'structure', label: 'Salary Structure', path: '/payroll/structure', icon: <Receipt className="h-4 w-4" /> },
      { id: 'payslips', label: 'Payslips', path: '/payroll/payslips', icon: <FileText className="h-4 w-4" /> },
    ],
  },
  {
    id: 'leave', label: 'Leave Management', icon: <CalendarDays className="h-4 w-4" />,
    items: [
      { id: 'leave-requests', label: 'Leave Requests', path: '/leave', icon: <CalendarDays className="h-4 w-4" />, badge: 5 },
      { id: 'leave-calendar', label: 'Leave Calendar', path: '/leave/calendar', icon: <CalendarDays className="h-4 w-4" /> },
    ],
  },
  {
    id: 'attendance', label: 'Attendance', icon: <Clock className="h-4 w-4" />,
    items: [
      { id: 'clock-in', label: 'Clock In', path: '/attendance', icon: <Clock className="h-4 w-4" /> },
      { id: 'timesheets', label: 'Timesheets', path: '/attendance/timesheets', icon: <Clock className="h-4 w-4" /> },
    ],
  },
  {
    id: 'assets', label: 'Assets', icon: <Laptop className="h-4 w-4" />,
    items: [
      { id: 'assets', label: 'All Assets', path: '/assets', icon: <Laptop className="h-4 w-4" /> },
      { id: 'assigned-assets', label: 'Assigned Assets', path: '/assets/assigned', icon: <Laptop className="h-4 w-4" /> },
    ],
  },
  {
    id: 'finance', label: 'Finance', icon: <Receipt className="h-4 w-4" />,
    items: [
      { id: 'expenses', label: 'Expenses', path: '/finance/expenses', icon: <Receipt className="h-4 w-4" />, badge: 8 },
      { id: 'budgets', label: 'Budgets', path: '/finance/budgets', icon: <DollarSign className="h-4 w-4" /> },
    ],
  },
  {
    id: 'compliance', label: 'Compliance', icon: <ShieldCheck className="h-4 w-4" />,
    items: [
      { id: 'compliance', label: 'Filing Status', path: '/compliance', icon: <ShieldCheck className="h-4 w-4" />, badge: 2 },
    ],
  },
  {
    id: 'kb', label: 'Knowledge Base', icon: <BookOpen className="h-4 w-4" />,
    items: [
      { id: 'articles', label: 'Articles', path: '/knowledge-base', icon: <BookOpen className="h-4 w-4" /> },
    ],
  },
  {
    id: 'support', label: 'Support Center', icon: <LifeBuoy className="h-4 w-4" />,
    items: [
      { id: 'tickets', label: 'Tickets', path: '/support/tickets', icon: <LifeBuoy className="h-4 w-4" />, badge: 12 },
      { id: 'escalations', label: 'Escalations', path: '/support/escalations', icon: <ShieldCheck className="h-4 w-4" /> },
    ],
  },
  {
    id: 'projects', label: 'Projects', icon: <KanbanSquare className="h-4 w-4" />,
    items: [
      { id: 'boards', label: 'Boards', path: '/projects', icon: <KanbanSquare className="h-4 w-4" /> },
    ],
  },
  {
    id: 'reports', label: 'Reports', icon: <BarChart3 className="h-4 w-4" />,
    items: [
      { id: 'employee-growth', label: 'Employee Growth', path: '/reports/growth', icon: <BarChart3 className="h-4 w-4" /> },
      { id: 'payroll-cost', label: 'Payroll Cost', path: '/reports/payroll', icon: <DollarSign className="h-4 w-4" /> },
    ],
  },
  {
    id: 'workflows', label: 'Workflow Automation', icon: <Zap className="h-4 w-4" />,
    items: [
      { id: 'workflows', label: 'Visual Builder', path: '/workflows', icon: <Zap className="h-4 w-4" /> },
    ],
  },
  {
    id: 'integrations', label: 'Integrations', icon: <Plug className="h-4 w-4" />,
    items: [
      { id: 'integrations', label: 'Marketplace', path: '/integrations', icon: <Plug className="h-4 w-4" /> },
    ],
  },
  {
    id: 'settings', label: 'Settings', icon: <Settings className="h-4 w-4" />,
    items: [
      { id: 'company', label: 'Company Settings', path: '/settings', icon: <Settings className="h-4 w-4" /> },
      { id: 'roles', label: 'Roles & Permissions', path: '/settings/roles', icon: <ShieldCheck className="h-4 w-4" /> },
    ],
  },
];

export const routeCount = navSections.reduce((acc, s) => acc + s.items.length, 0);
