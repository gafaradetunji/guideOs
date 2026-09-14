import { useState } from 'react';
import { useRouter } from './lib/router';
import { Sidebar, Header } from './components/shell/Sidebar';
import { DashboardPage, ActivityFeedPage, NotificationsPage } from './pages/dashboard/DashboardPage';
import { EmployeeDirectoryPage, DepartmentsPage } from './pages/employees/EmployeeDirectoryPage';
import { EmployeeDetailPage } from './pages/employees/EmployeeDetailPage';
import { OrgChartPage } from './pages/employees/OrgChartPage';
import { OnboardingPage, OnboardingChecklistPage } from './pages/onboarding/OnboardingPage';
import { LeadsPage, OpportunitiesPage, CompaniesPage, ContactsPage, PipelinesPage } from './pages/crm/CrmPages';
import { PayrollRunsPage, PayrollRunDetailPage, SalaryStructurePage, PayslipsPage, CustomerListPage, ContractsPage } from './pages/payroll/PayrollPages';
import { InvoicesPage, InvoiceDetailPage } from './pages/invoices/InvoicePages';
import {
  LeaveRequestsPage, LeaveCalendarPage, AssetsPage, AssetsAssignedPage,
  TicketsPage, EscalationsPage, KnowledgeBasePage, ProjectsPage,
  CandidatesPage, PositionsPage, ExpensesPage, BudgetsPage,
  CompliancePage, AttendancePage, TimesheetsPage,
  EmployeeGrowthReportPage, PayrollCostReportPage, WorkflowsPage,
  IntegrationsPage, SettingsPage, RolesPage,
} from './pages/modules/ModulePages';

function App() {
  const { path, navigate } = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  const page = renderRoute(path, navigate);

  return (
    <div className="flex h-screen overflow-hidden bg-ink-50 console-grid">
      <Sidebar path={path} onNavigate={navigate} collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header path={path} onNavigate={navigate} />
        <main className="flex-1 overflow-y-auto scrollbar-thin">{page}</main>
      </div>
    </div>
  );
}

function renderRoute(path: string, navigate: (to: string) => void) {
  const props = { path, navigate };

  // Dashboard
  if (path === '/' || path === '') return <DashboardPage {...props} />;
  if (path === '/activity') return <ActivityFeedPage />;
  if (path === '/notifications') return <NotificationsPage />;

  // CRM
  if (path === '/crm/leads') return <LeadsPage {...props} />;
  if (path === '/crm/contacts') return <ContactsPage {...props} />;
  if (path === '/crm/companies') return <CompaniesPage {...props} />;
  if (path === '/crm/opportunities') return <OpportunitiesPage {...props} />;
  if (path === '/crm/pipelines') return <PipelinesPage {...props} />;

  // Customers
  if (path === '/customers') return <CustomerListPage {...props} />;
  if (path === '/customers/contracts') return <ContractsPage {...props} />;
  if (path === '/customers/invoices') return <InvoicesPage {...props} />;
  if (path.startsWith('/customers/invoices/')) return <InvoiceDetailPage {...props} />;

  // Employees
  if (path === '/employees') return <EmployeeDirectoryPage {...props} />;
  if (path === '/employees/departments') return <DepartmentsPage {...props} />;
  if (path === '/employees/org-chart') return <OrgChartPage {...props} />;
  if (path.startsWith('/employees/')) return <EmployeeDetailPage {...props} />;

  // Recruitment
  if (path === '/recruitment/candidates') return <CandidatesPage {...props} />;
  if (path === '/recruitment/positions') return <PositionsPage {...props} />;

  // Onboarding
  if (path === '/onboarding') return <OnboardingChecklistPage {...props} />;
  if (path === '/onboarding/wizard') return <OnboardingPage {...props} />;

  // Payroll
  if (path === '/payroll') return <PayrollRunsPage {...props} />;
  if (path.startsWith('/payroll/runs/')) return <PayrollRunDetailPage {...props} />;
  if (path === '/payroll/structure') return <SalaryStructurePage {...props} />;
  if (path === '/payroll/payslips') return <PayslipsPage {...props} />;

  // Leave
  if (path === '/leave') return <LeaveRequestsPage {...props} />;
  if (path === '/leave/calendar') return <LeaveCalendarPage {...props} />;

  // Attendance
  if (path === '/attendance') return <AttendancePage {...props} />;
  if (path === '/attendance/timesheets') return <TimesheetsPage {...props} />;

  // Assets
  if (path === '/assets') return <AssetsPage {...props} />;
  if (path === '/assets/assigned') return <AssetsAssignedPage {...props} />;

  // Finance
  if (path === '/finance/expenses') return <ExpensesPage {...props} />;
  if (path === '/finance/budgets') return <BudgetsPage {...props} />;

  // Compliance
  if (path === '/compliance') return <CompliancePage {...props} />;

  // KB
  if (path === '/knowledge-base') return <KnowledgeBasePage {...props} />;

  // Support
  if (path === '/support/tickets') return <TicketsPage {...props} />;
  if (path === '/support/escalations') return <EscalationsPage {...props} />;

  // Projects
  if (path === '/projects') return <ProjectsPage {...props} />;

  // Reports
  if (path === '/reports/growth') return <EmployeeGrowthReportPage {...props} />;
  if (path === '/reports/payroll') return <PayrollCostReportPage {...props} />;

  // Workflows
  if (path === '/workflows') return <WorkflowsPage {...props} />;

  // Integrations
  if (path === '/integrations') return <IntegrationsPage {...props} />;

  // Settings
  if (path === '/settings') return <SettingsPage {...props} />;
  if (path === '/settings/roles') return <RolesPage {...props} />;

  return <NotFound path={path} navigate={navigate} />;
}

function NotFound({ path, navigate }: { path: string; navigate: (to: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <p className="text-6xl font-bold text-ink-200">404</p>
      <p className="text-sm font-medium text-ink-900 mt-2">Page not found</p>
      <p className="text-xs text-ink-500 mt-1">The route <code className="font-mono">{path}</code> doesn't exist.</p>
      <button onClick={() => navigate('/')} className="mt-4 text-sm font-medium text-brand-600 hover:text-brand-700">Back to Dashboard</button>
    </div>
  );
}

export default App;
