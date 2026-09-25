import type { RouteObject } from 'react-router-dom';

import DashboardLayout from '@/layouts/DashboardLayout';
import NotFound from '@/pages/errors/NotFound';
import { withRouteProps } from '@/routes/withRouteProps';

import { DashboardPage, ActivityFeedPage, NotificationsPage } from '@/pages/dashboard/DashboardPage';
import { EmployeeDirectoryPage, DepartmentsPage } from '@/pages/employees/EmployeeDirectoryPage';
import { EmployeeDetailPage } from '@/pages/employees/EmployeeDetailPage';
import { OrgChartPage } from '@/pages/employees/OrgChartPage';
import { OnboardingPage, OnboardingChecklistPage } from '@/pages/onboarding/OnboardingPage';
import { LeadsPage, OpportunitiesPage, CompaniesPage, ContactsPage, PipelinesPage } from '@/pages/crm/CrmPages';
import {
  PayrollRunsPage, PayrollRunDetailPage, SalaryStructurePage, PayslipsPage,
  CustomerListPage, ContractsPage,
} from '@/pages/payroll/PayrollPages';
import { InvoicesPage, InvoiceDetailPage } from '@/pages/invoices/InvoicePages';
import {
  LeaveRequestsPage, LeaveCalendarPage, AssetsPage, AssetsAssignedPage,
  TicketsPage, EscalationsPage, KnowledgeBasePage, ProjectsPage,
  CandidatesPage, PositionsPage, ExpensesPage, BudgetsPage,
  CompliancePage, AttendancePage, TimesheetsPage,
  EmployeeGrowthReportPage, PayrollCostReportPage, WorkflowsPage,
  IntegrationsPage, SettingsPage, RolesPage,
} from '@/pages/modules/ModulePages';


/**
 * Each page is adapted once here, at module scope, so the component identity is
 * stable across renders and React keeps page state on re-render.
 */
const AssetsAssignedPageRoute = withRouteProps(AssetsAssignedPage);
const AssetsPageRoute = withRouteProps(AssetsPage);
const AttendancePageRoute = withRouteProps(AttendancePage);
const BudgetsPageRoute = withRouteProps(BudgetsPage);
const CandidatesPageRoute = withRouteProps(CandidatesPage);
const CompaniesPageRoute = withRouteProps(CompaniesPage);
const CompliancePageRoute = withRouteProps(CompliancePage);
const ContactsPageRoute = withRouteProps(ContactsPage);
const ContractsPageRoute = withRouteProps(ContractsPage);
const CustomerListPageRoute = withRouteProps(CustomerListPage);
const DashboardPageRoute = withRouteProps(DashboardPage);
const DepartmentsPageRoute = withRouteProps(DepartmentsPage);
const EmployeeDetailPageRoute = withRouteProps(EmployeeDetailPage);
const EmployeeDirectoryPageRoute = withRouteProps(EmployeeDirectoryPage);
const EmployeeGrowthReportPageRoute = withRouteProps(EmployeeGrowthReportPage);
const EscalationsPageRoute = withRouteProps(EscalationsPage);
const ExpensesPageRoute = withRouteProps(ExpensesPage);
const IntegrationsPageRoute = withRouteProps(IntegrationsPage);
const InvoiceDetailPageRoute = withRouteProps(InvoiceDetailPage);
const InvoicesPageRoute = withRouteProps(InvoicesPage);
const KnowledgeBasePageRoute = withRouteProps(KnowledgeBasePage);
const LeadsPageRoute = withRouteProps(LeadsPage);
const LeaveCalendarPageRoute = withRouteProps(LeaveCalendarPage);
const LeaveRequestsPageRoute = withRouteProps(LeaveRequestsPage);
const OnboardingChecklistPageRoute = withRouteProps(OnboardingChecklistPage);
const OnboardingPageRoute = withRouteProps(OnboardingPage);
const OpportunitiesPageRoute = withRouteProps(OpportunitiesPage);
const OrgChartPageRoute = withRouteProps(OrgChartPage);
const PayrollCostReportPageRoute = withRouteProps(PayrollCostReportPage);
const PayrollRunDetailPageRoute = withRouteProps(PayrollRunDetailPage);
const PayrollRunsPageRoute = withRouteProps(PayrollRunsPage);
const PayslipsPageRoute = withRouteProps(PayslipsPage);
const PipelinesPageRoute = withRouteProps(PipelinesPage);
const PositionsPageRoute = withRouteProps(PositionsPage);
const ProjectsPageRoute = withRouteProps(ProjectsPage);
const RolesPageRoute = withRouteProps(RolesPage);
const SalaryStructurePageRoute = withRouteProps(SalaryStructurePage);
const SettingsPageRoute = withRouteProps(SettingsPage);
const TicketsPageRoute = withRouteProps(TicketsPage);
const TimesheetsPageRoute = withRouteProps(TimesheetsPage);
const WorkflowsPageRoute = withRouteProps(WorkflowsPage);

/**
 * The GuideOS console. Everything here renders inside the sidebar shell.
 *
 * Paths stay relative to the layout's `/` so the whole tree can be remounted
 * under a different prefix without touching each entry.
 */
export const guideosRoutes: RouteObject[] = [
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      // ----- Dashboard -----
      { index: true, element: <DashboardPageRoute /> },
      { path: 'activity', element: <ActivityFeedPage /> },
      { path: 'notifications', element: <NotificationsPage /> },

      // ----- CRM -----
      {
        path: 'crm',
        children: [
          { path: 'leads', element: <LeadsPageRoute /> },
          { path: 'contacts', element: <ContactsPageRoute /> },
          { path: 'companies', element: <CompaniesPageRoute /> },
          { path: 'opportunities', element: <OpportunitiesPageRoute /> },
          { path: 'pipelines', element: <PipelinesPageRoute /> },
        ],
      },

      // ----- Customers -----
      {
        path: 'customers',
        children: [
          { index: true, element: <CustomerListPageRoute /> },
          { path: 'contracts', element: <ContractsPageRoute /> },
          { path: 'invoices', element: <InvoicesPageRoute /> },
          { path: 'invoices/:id', element: <InvoiceDetailPageRoute /> },
        ],
      },

      // ----- Employees -----
      {
        path: 'employees',
        children: [
          { index: true, element: <EmployeeDirectoryPageRoute /> },
          { path: 'departments', element: <DepartmentsPageRoute /> },
          { path: 'org-chart', element: <OrgChartPageRoute /> },
          { path: ':id', element: <EmployeeDetailPageRoute /> },
        ],
      },

      // ----- Recruitment -----
      {
        path: 'recruitment',
        children: [
          { path: 'candidates', element: <CandidatesPageRoute /> },
          { path: 'positions', element: <PositionsPageRoute /> },
        ],
      },

      // ----- Onboarding -----
      {
        path: 'onboarding',
        children: [
          { index: true, element: <OnboardingChecklistPageRoute /> },
          { path: 'wizard', element: <OnboardingPageRoute /> },
        ],
      },

      // ----- Payroll -----
      {
        path: 'payroll',
        children: [
          { index: true, element: <PayrollRunsPageRoute /> },
          { path: 'runs/:id', element: <PayrollRunDetailPageRoute /> },
          { path: 'structure', element: <SalaryStructurePageRoute /> },
          { path: 'payslips', element: <PayslipsPageRoute /> },
        ],
      },

      // ----- Leave -----
      {
        path: 'leave',
        children: [
          { index: true, element: <LeaveRequestsPageRoute /> },
          { path: 'calendar', element: <LeaveCalendarPageRoute /> },
        ],
      },

      // ----- Attendance -----
      {
        path: 'attendance',
        children: [
          { index: true, element: <AttendancePageRoute /> },
          { path: 'timesheets', element: <TimesheetsPageRoute /> },
        ],
      },

      // ----- Assets -----
      {
        path: 'assets',
        children: [
          { index: true, element: <AssetsPageRoute /> },
          { path: 'assigned', element: <AssetsAssignedPageRoute /> },
        ],
      },

      // ----- Finance -----
      {
        path: 'finance',
        children: [
          { path: 'expenses', element: <ExpensesPageRoute /> },
          { path: 'budgets', element: <BudgetsPageRoute /> },
        ],
      },

      // ----- Support -----
      {
        path: 'support',
        children: [
          { path: 'tickets', element: <TicketsPageRoute /> },
          { path: 'escalations', element: <EscalationsPageRoute /> },
        ],
      },

      // ----- Reports -----
      {
        path: 'reports',
        children: [
          { path: 'growth', element: <EmployeeGrowthReportPageRoute /> },
          { path: 'payroll', element: <PayrollCostReportPageRoute /> },
        ],
      },

      // ----- Settings -----
      {
        path: 'settings',
        children: [
          { index: true, element: <SettingsPageRoute /> },
          { path: 'roles', element: <RolesPageRoute /> },
        ],
      },

      // ----- Standalone modules -----
      { path: 'compliance', element: <CompliancePageRoute /> },
      { path: 'knowledge-base', element: <KnowledgeBasePageRoute /> },
      { path: 'projects', element: <ProjectsPageRoute /> },
      { path: 'workflows', element: <WorkflowsPageRoute /> },
      { path: 'integrations', element: <IntegrationsPageRoute /> },

      // Unmatched paths still render inside the shell, so the sidebar stays put.
      { path: '*', element: <NotFound /> },
    ],
  },
];
