import { useState } from 'react';
import { Check, ChevronLeft, ChevronRight, User, Briefcase, Landmark, ReceiptText, ShieldCheck, FileText, Eye, Send, Sparkles, Clock } from 'lucide-react';
import { PageHeader, Breadcrumbs, Card, CardHeader, CardBody, Avatar, Button, Input, Select, Badge } from '../../components/ui';
import { onboardingSteps, employees, departments, formatCurrency, formatDate, fullName } from '../../data/seed';
import type { RouteProps } from '../../lib/types';

const steps = [
  { id: 1, label: 'Personal Details', icon: <User className="h-4 w-4" /> },
  { id: 2, label: 'Employment', icon: <Briefcase className="h-4 w-4" /> },
  { id: 3, label: 'Bank Information', icon: <Landmark className="h-4 w-4" /> },
  { id: 4, label: 'Tax Information', icon: <ReceiptText className="h-4 w-4" /> },
  { id: 5, label: 'Pension & NHF', icon: <ShieldCheck className="h-4 w-4" /> },
  { id: 6, label: 'Documents', icon: <FileText className="h-4 w-4" /> },
  { id: 7, label: 'Review', icon: <Eye className="h-4 w-4" /> },
];

export function OnboardingPage({ navigate }: RouteProps) {
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  function next() {
    setCompleted(s => new Set(s).add(step));
    if (step < 7) setStep(step + 1);
  }
  function prev() { if (step > 1) setStep(step - 1); }

  return (
    <div>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: 'Onboarding' }, { label: 'New Hire' }]} />}
        title="Onboard a New Employee"
        description="Complete the 7-step onboarding wizard. Progress saves automatically."
        actions={<Button variant="outline" size="sm" onClick={() => navigate('/onboarding/checklist')}>View Open Checklists</Button>}
      />

      <div className="p-6">
        {/* Wizard stepper */}
        <Card className="mb-4">
          <CardBody>
            <div className="flex items-center justify-between">
              {steps.map((s, i) => {
                const isCurrent = s.id === step;
                const isDone = completed.has(s.id);
                const isLast = i === steps.length - 1;
                return (
                  <div key={s.id} className="flex items-center flex-1 last:flex-none">
                    <button onClick={() => setStep(s.id)} className="flex items-center gap-2.5 group">
                      <span className={[
                        'h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all',
                        isDone ? 'bg-emerald-500 border-emerald-500 text-white' : isCurrent ? 'bg-brand-600 border-brand-600 text-white' : 'bg-white border-ink-200 text-ink-400 group-hover:border-ink-300',
                      ].join(' ')}>
                        {isDone ? <Check className="h-4 w-4" /> : s.icon}
                      </span>
                      <div className="hidden md:block text-left">
                        <p className="text-[11px] text-ink-400">Step {s.id}</p>
                        <p className={['text-xs font-medium', isCurrent ? 'text-brand-700' : isDone ? 'text-ink-900' : 'text-ink-500'].join(' ')}>{s.label}</p>
                      </div>
                    </button>
                    {!isLast && <div className={['h-px flex-1 mx-3', isDone ? 'bg-emerald-300' : 'bg-ink-200'].join(' ')} />}
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader title={`Step ${step}: ${steps[step - 1].label}`} subtitle={`Complete this section to proceed (${step} of 7)`} />
              <CardBody>
                {step === 1 && <PersonalStep />}
                {step === 2 && <EmploymentStep />}
                {step === 3 && <BankStep />}
                {step === 4 && <TaxStep />}
                {step === 5 && <PensionStep />}
                {step === 6 && <DocumentsStep />}
                {step === 7 && <ReviewStep />}
              </CardBody>
              <div className="flex items-center justify-between px-5 py-4 border-t border-ink-200 bg-ink-50">
                <Button variant="ghost" size="md" onClick={prev} leftIcon={<ChevronLeft className="h-4 w-4" />} disabled={step === 1}>Back</Button>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="md" onClick={() => navigate('/onboarding')}>Save draft</Button>
                  {step < 7 ? (
                    <Button size="md" onClick={next} rightIcon={<ChevronRight className="h-4 w-4" />}>Continue</Button>
                  ) : (
                    <Button size="md" onClick={() => navigate('/employees')} leftIcon={<Sparkles className="h-4 w-4" />}>Submit Onboarding</Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Side preview */}
          <Card>
            <CardHeader title="Employee Preview" />
            <CardBody>
              <div className="flex flex-col items-center text-center py-4">
                <Avatar name="New Employee" size={64} />
                <p className="text-base font-semibold text-ink-900 mt-3">{employees[2].firstName} (Draft)</p>
                <p className="text-xs text-ink-500">Step {step} of 7 in progress</p>
                <div className="w-full mt-4 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-600 transition-all" style={{ width: `${(step / 7) * 100}%` }} />
                </div>
                <p className="text-[11px] text-ink-400 mt-1.5">{Math.round((step / 7) * 100)}% completed</p>
              </div>
              <div className="mt-3 border-t border-ink-100 pt-3">
                <p className="text-[11px] font-medium text-ink-500 uppercase tracking-wide mb-2">Up next</p>
                <ul className="space-y-1.5">
                  {steps.slice(step, step + 4).map(s => (
                    <li key={s.id} className="flex items-center gap-2 text-xs text-ink-600">
                      <span className="h-5 w-5 rounded-full bg-ink-100 text-ink-500 flex items-center justify-center text-[10px]">{s.id}</span>
                      {s.label}
                    </li>
                  ))}
                </ul>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

function PersonalStep() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="First Name" required><Input placeholder="Adaobi" /></Field>
      <Field label="Last Name" required><Input placeholder="Okoye" /></Field>
      <Field label="Email" required><Input type="email" placeholder="adaobi.okoye@nerithonx.com" /></Field>
      <Field label="Phone" required><Input placeholder="+234 803 123 4567" /></Field>
      <Field label="Date of Birth" required><Input type="date" /></Field>
      <Field label="Gender"><Select><option>Prefer not to say</option><option>Female</option><option>Male</option><option>Non-binary</option></Select></Field>
      <Field label="Country" required><Select><option>Nigeria</option><option>Kenya</option><option>Ghana</option><option>UK</option></Select></Field>
      <Field label="City" required><Input placeholder="Lagos" /></Field>
      <Field label="Residential Address" full><Input placeholder="10 Adeola Odeku Street, Victoria Island, Lagos" /></Field>
      <Field label="Emergency Contact Name" full><Input placeholder="Ngozi Okoye" /></Field>
      <Field label="Emergency Contact Phone"><Input placeholder="+234 803 999 8888" /></Field>
      <Field label="Relationship"><Select><option>Spouse</option><option>Parent</option><option>Sibling</option><option>Guardian</option></Select></Field>
    </div>
  );
}

function EmploymentStep() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Job Title" required><Input placeholder="Senior Backend Engineer" /></Field>
      <Field label="Department" required>
        <Select>{departments.map(d => <option key={d.id}>{d.name}</option>)}</Select>
      </Field>
      <Field label="Team"><Select><option>Backend</option><option>Frontend</option><option>Platform</option></Select></Field>
      <Field label="Employment Type" required>
        <Select><option>Full-time</option><option>Contractor</option><option>Part-time</option><option>Intern</option></Select>
      </Field>
      <Field label="Reporting Manager" required>
        <Select>{employees.filter(e => e.id !== 'e-001').slice(0, 12).map(e => <option key={e.id}>{fullName(e)}</option>)}</Select>
      </Field>
      <Field label="Level" required><Select><option>L1</option><option>L2</option><option>L3</option><option>L4</option><option>L5</option><option>L6</option><option>L7</option></Select></Field>
      <Field label="Start Date" required><Input type="date" /></Field>
      <Field label="Work Location"><Select><option>Lagos (HQ)</option><option>Remote - Nigeria</option><option>Remote - Global</option><option>Abuja</option></Select></Field>
      <Field label="Annual Salary (USD)" required><Input type="number" placeholder="80000" /></Field>
      <Field label="Probation Period"><Select><option>3 months</option><option>6 months</option><option>None</option></Select></Field>
    </div>
  );
}

function BankStep() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Bank Name" required><Select><option>GTBank</option><option>Access Bank</option><option>Zenith Bank</option><option>First Bank</option><option>UBA</option><option>Kuda</option><option>Stanbic IBTC</option></Select></Field>
      <Field label="Account Type"><Select><option>Savings</option><option>Current</option><option>Domiciliary</option></Select></Field>
      <Field label="Account Name" required full><Input placeholder="Adaobi Okoye" /></Field>
      <Field label="Account Number" required><Input placeholder="0123456789" /></Field>
      <Field label="BVN" required><Input placeholder="00000000000" /></Field>
      <Field label="Sort Code"><Input placeholder="058152930" /></Field>
      <Field label="Swift Code"><Input placeholder="GTBINGLA" /></Field>
      <div className="md:col-span-2 p-3 rounded-lg bg-brand-50 border border-brand-100 text-xs text-brand-800">
        Bank account details will be used for monthly salary disbursement via the Payroll module.
      </div>
    </div>
  );
}

function TaxStep() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Tax Identification Number (TIN)" required><Input placeholder="12345678-0000" /></Field>
      <Field label="Filing State" required><Select><option>Lagos</option><option>FCT - Abuja</option><option>Rivers</option><option>Kano</option></Select></Field>
      <Field label="National Insurance Number (NIN)"><Input placeholder="0000000000" /></Field>
      <Field label="Tax Residency"><Select><option>Resident</option><option>Non-resident</option></Select></Field>
      <Field label="NSITF Number" required><Input placeholder="NSITF-0000000" /></Field>
      <Field label="ITF Number"><Input placeholder="ITF-0000000" /></Field>
      <div className="md:col-span-2 p-3 rounded-lg bg-amber-50 border border-amber-100 text-xs text-amber-800">
        Note: PAYE will be calculated automatically based on state of filing. Default Lagos state tax bands apply.
      </div>
    </div>
  );
}

function PensionStep() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Pension Fund Administrator (PFA)" required>
        <Select><option>Stanbic IBTC Pension</option><option>ARM Pension</option><option>Legacy Pension</option><option>FCMB Pensions</option></Select>
      </Field>
      <Field label="Pension Account Number" required><Input placeholder="PFA-0000000" /></Field>
      <Field label="Employee Contribution"><Input value="8%" disabled /></Field>
      <Field label="Employer Contribution"><Input value="10%" disabled /></Field>
      <Field label="NHF Number" required><Input placeholder="NHF-0000000" /></Field>
      <Field label="NHF Contribution"><Input value="2.5%" disabled /></Field>
      <Field label="Health Insurance Provider"><Select><option>AXA Mansard</option><option>Reliance HMO</option><option>Hygeia HMO</option></Select></Field>
      <Field label="Health Plan"><Select><option>Family</option><option>Individual</option><option>Parent Plus</option></Select></Field>
      <div className="md:col-span-2 p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-xs text-emerald-800">
        All compliance forms will auto-generate a PDF and be filed in the employee's Documents tab.
      </div>
    </div>
  );
}

function DocumentsStep() {
  const docList = [
    { name: 'Signed Offer Letter', required: true },
    { name: 'Government-issued ID', required: true },
    { name: 'Passport Photograph', required: true },
    { name: 'Proof of Address', required: true },
    { name: 'Educational Certificate', required: false },
    { name: 'Previous Employment Letter', required: false },
    { name: 'Bank Verification Number (BVN) Slip', required: true },
    { name: 'Pension Enrolment Form', required: true },
  ];
  return (
    <div className="space-y-2">
      <p className="text-xs text-ink-500 mb-3">Upload required documents. Files must be PDF, JPG, or PNG and under 5MB.</p>
      {docList.map(d => (
        <div key={d.name} className="flex items-center justify-between p-3 rounded-lg border border-ink-200 hover:bg-ink-50/50">
          <div className="flex items-center gap-3">
            <span className="h-9 w-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center"><FileText className="h-4 w-4" /></span>
            <div>
              <p className="text-sm font-medium text-ink-900">{d.name} {d.required && <span className="text-red-500">*</span>}</p>
              <p className="text-[11px] text-ink-500">{d.required ? 'Required' : 'Optional'}</p>
            </div>
          </div>
          <Button variant="outline" size="sm">Upload</Button>
        </div>
      ))}
    </div>
  );
}

function ReviewStep() {
  return (
    <div className="space-y-3">
      <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100 flex items-start gap-3">
        <Sparkles className="h-4 w-4 text-emerald-600 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-emerald-900">Ready to submit</p>
          <p className="text-xs text-emerald-700 mt-0.5">Review the summary below. Submitting will create the employee, provision accounts, and trigger the onboarding checklist.</p>
        </div>
      </div>
      <ReviewSection title="Personal" rows={[['Name','Adaobi Okoye'], ['Email','adaobi.okoye@nerithonx.com'], ['Phone','+234 803 123 4567'], ['Location','Lagos, Nigeria']]} />
      <ReviewSection title="Employment" rows={[['Job Title','Senior Backend Engineer'], ['Department','Engineering'], ['Manager','Sade Adewale'], ['Level','L5'], ['Salary','$95,000/yr'], ['Start Date','July 1, 2025']]} />
      <ReviewSection title="Banking" rows={[['Bank','GTBank'], ['Account','0123456789'], ['Type','Savings']]} />
      <ReviewSection title="Tax & Compliance" rows={[['TIN','12345678-0000'], ['Filing State','Lagos'], ['NSITF','NSITF-0000000'], ['Pension PFA','Stanbic IBTC'], ['NHF','NHF-0000000']]} />
      <label className="flex items-start gap-2 mt-4 cursor-pointer">
        <input type="checkbox" className="mt-0.5" />
        <span className="text-xs text-ink-600">I confirm all information provided is accurate. Onboarding checklist will begin immediately upon submission.</span>
      </label>
    </div>
  );
}

function ReviewSection({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <div className="border border-ink-200 rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-ink-50 border-b border-ink-200 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-700">{title}</p>
        <Button variant="ghost" size="xs">Edit</Button>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 px-4 py-3">
        {rows.map(([k, v]) => (
          <div key={k}>
            <p className="text-[11px] text-ink-500">{k}</p>
            <p className="text-sm text-ink-900">{v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children, required, full }: { label: string; children: React.ReactNode; required?: boolean; full?: boolean }) {
  return (
    <div className={full ? 'md:col-span-2' : ''}>
      <label className="block text-xs font-medium text-ink-700 mb-1.5">{label} {required && <span className="text-red-500">*</span>}</label>
      {children}
    </div>
  );
}

// Onboarding checklist page - shows ongoing hires
export function OnboardingChecklistPage({ navigate }: RouteProps) {
  const inProgress = employees.filter(e => e.status === 'probation').slice(0, 6);

  return (
    <div>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: 'Onboarding' }, { label: 'Checklists' }]} />}
        title="New Hire Checklists"
        description={`${inProgress.length} employees currently onboarding`}
        actions={<Button size="sm" leftIcon={<Sparkles className="h-3.5 w-3.5" />} onClick={() => navigate('/onboarding/wizard')}>Start New Onboarding</Button>}
      />
      <div className="p-6 space-y-3">
        {inProgress.map(emp => {
          const stepIdx = Math.floor((emp.onboardingProgress || 0) / 11);
          const nextStep = onboardingSteps[Math.min(stepIdx, onboardingSteps.length - 1)];
          const dept = departments.find(d => d.id === emp.departmentId);
          return (
            <Card key={emp.id} className="hover:shadow-cardlg cursor-pointer" >
              <div className="p-4 flex items-center gap-4" onClick={() => navigate(`/employees/${emp.id}`)}>
                <Avatar name={fullName(emp)} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink-900">{fullName(emp)}</p>
                  <p className="text-[11px] text-ink-500">{emp.jobTitle} • {dept?.name}</p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-3">
                  <Clock className="h-3.5 w-3.5 text-ink-400" />
                  <span className="text-xs text-ink-500">Next: {nextStep?.title}</span>
                </div>
                <div className="w-32">
                  <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                    <div className={`h-full ${emp.onboardingProgress === 100 ? 'bg-emerald-500' : 'bg-brand-600'} transition-all`} style={{ width: `${emp.onboardingProgress}%` }} />
                  </div>
                  <p className="text-[11px] text-ink-400 mt-0.5">{emp.onboardingProgress}% complete</p>
                </div>
                <Badge tone={emp.onboardingProgress === 100 ? 'green' : 'amber'} dot>{emp.onboardingProgress === 100 ? 'Ready' : 'In Progress'}</Badge>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
