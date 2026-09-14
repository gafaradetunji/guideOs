import { useEffect, useMemo, useState } from 'react';
import { Check, ChevronLeft, ChevronRight, User, Briefcase, Landmark, ReceiptText, ShieldCheck, FileText, Eye, Sparkles, Clock } from 'lucide-react';
import { PageHeader, Breadcrumbs, Card, CardHeader, CardBody, Avatar, Button, Input, Select, Badge } from '../../components/ui';
import { departments, teams, employees as seedEmployees, onboardingSteps, fullName } from '../../data/seed';
import { useMockData, type OnboardingDraft } from '../../mock/MockDataProvider';
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

const requiredDocuments = [
  'Signed Offer Letter',
  'Government-issued ID',
  'Passport Photograph',
  'Proof of Address',
  'Bank Verification Number (BVN) Slip',
  'Pension Enrolment Form',
];

const allDocuments = [
  { name: 'Signed Offer Letter', required: true },
  { name: 'Government-issued ID', required: true },
  { name: 'Passport Photograph', required: true },
  { name: 'Proof of Address', required: true },
  { name: 'Educational Certificate', required: false },
  { name: 'Previous Employment Letter', required: false },
  { name: 'Bank Verification Number (BVN) Slip', required: true },
  { name: 'Pension Enrolment Form', required: true },
];

export function OnboardingPage({ navigate }: RouteProps) {
  const { onboardingDraft, setOnboardingDraft, createEmployeeFromOnboarding, employees } = useMockData();
  const [step, setStep] = useState(1);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [form, setForm] = useState<OnboardingDraft>(() => onboardingDraft);
  const [statusText, setStatusText] = useState('Draft synced locally');

  useEffect(() => {
    setForm(onboardingDraft);
  }, [onboardingDraft]);

  useEffect(() => {
    setOnboardingDraft(form);
  }, [form, setOnboardingDraft]);

  const availableTeams = useMemo(
    () => teams.filter(team => team.departmentId === form.departmentId),
    [form.departmentId]
  );

  const managers = useMemo(
    () => employees.filter(employee => employee.id !== 'e-001').slice(0, 20),
    [employees]
  );

  const fullDraftName = `${form.firstName} ${form.lastName}`.trim();
  const previewName = fullDraftName || 'New Employee';
  const completion = Math.round((step / steps.length) * 100);
  const uploadedRequiredCount = requiredDocuments.filter(name => form.uploadedDocuments.includes(name)).length;
  const allRequiredUploaded = requiredDocuments.every(name => form.uploadedDocuments.includes(name));
  const canSubmit = Boolean(
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.email.trim() &&
    form.jobTitle.trim() &&
    form.startDate &&
    form.annualSalary &&
    form.accountNumber &&
    form.tin &&
    allRequiredUploaded &&
    form.confirmed
  );

  function updateField<K extends keyof OnboardingDraft>(key: K, value: OnboardingDraft[K]) {
    setForm(current => ({ ...current, [key]: value }));
    setStatusText('Draft updated');
  }

  function next() {
    setCompleted(current => new Set(current).add(step));
    if (step < 7) setStep(step + 1);
  }

  function prev() {
    if (step > 1) setStep(step - 1);
  }

  function saveDraft() {
    setOnboardingDraft(form);
    setStatusText(`Draft saved at ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`);
  }

  function submit() {
    if (!canSubmit) return;
    const employee = createEmployeeFromOnboarding(form);
    navigate(`/employees/${employee.id}`);
  }

  function toggleDocument(name: string) {
    updateField(
      'uploadedDocuments',
      form.uploadedDocuments.includes(name)
        ? form.uploadedDocuments.filter(item => item !== name)
        : [...form.uploadedDocuments, name]
    );
  }

  return (
    <div>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: 'Onboarding' }, { label: 'New Hire' }]} />}
        title="Onboard a New Employee"
        description="Complete the 7-step onboarding wizard. Draft changes persist locally across refreshes."
        actions={<Button variant="outline" size="sm" onClick={() => navigate('/onboarding')}>View Open Checklists</Button>}
      />

      <div className="p-6">
        <Card className="mb-4">
          <CardBody>
            <div className="flex items-center justify-between">
              {steps.map((item, index) => {
                const isCurrent = item.id === step;
                const isDone = completed.has(item.id);
                const isLast = index === steps.length - 1;
                return (
                  <div key={item.id} className="flex items-center flex-1 last:flex-none">
                    <button onClick={() => setStep(item.id)} className="flex items-center gap-2.5 group">
                      <span className={[
                        'h-9 w-9 rounded-full flex items-center justify-center border-2 transition-all',
                        isDone ? 'bg-emerald-500 border-emerald-500 text-white' : isCurrent ? 'bg-brand-600 border-brand-600 text-white' : 'bg-white border-ink-200 text-ink-400 group-hover:border-ink-300',
                      ].join(' ')}>
                        {isDone ? <Check className="h-4 w-4" /> : item.icon}
                      </span>
                      <div className="hidden md:block text-left">
                        <p className="text-[11px] text-ink-400">Step {item.id}</p>
                        <p className={['text-xs font-medium', isCurrent ? 'text-brand-700' : isDone ? 'text-ink-900' : 'text-ink-500'].join(' ')}>{item.label}</p>
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
          <div className="lg:col-span-2">
            <Card>
              <CardHeader
                title={`Step ${step}: ${steps[step - 1].label}`}
                subtitle={`Complete this section to proceed (${step} of 7)`}
                action={<span className="text-[11px] font-mono uppercase tracking-[0.08em] text-ink-500">{statusText}</span>}
              />
              <CardBody>
                {step === 1 && <PersonalStep form={form} onChange={updateField} />}
                {step === 2 && <EmploymentStep form={form} onChange={updateField} availableTeams={availableTeams} managers={managers} />}
                {step === 3 && <BankStep form={form} onChange={updateField} />}
                {step === 4 && <TaxStep form={form} onChange={updateField} />}
                {step === 5 && <PensionStep form={form} onChange={updateField} />}
                {step === 6 && <DocumentsStep uploadedDocuments={form.uploadedDocuments} onToggleDocument={toggleDocument} />}
                {step === 7 && <ReviewStep form={form} onChange={updateField} onEditStep={setStep} />}
              </CardBody>
              <div className="flex items-center justify-between px-5 py-4 border-t border-ink-200 bg-ink-50">
                <Button variant="ghost" size="md" onClick={prev} leftIcon={<ChevronLeft className="h-4 w-4" />} disabled={step === 1}>Back</Button>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="md" onClick={saveDraft}>Save draft</Button>
                  {step < 7 ? (
                    <Button size="md" onClick={next} rightIcon={<ChevronRight className="h-4 w-4" />}>Continue</Button>
                  ) : (
                    <Button size="md" onClick={submit} leftIcon={<Sparkles className="h-4 w-4" />} disabled={!canSubmit}>Submit Onboarding</Button>
                  )}
                </div>
              </div>
            </Card>
          </div>

          <Card>
            <CardHeader title="Employee Preview" />
            <CardBody>
              <div className="flex flex-col items-center text-center py-4">
                <Avatar name={previewName} size={64} />
                <p className="text-base font-semibold text-ink-900 mt-3">{previewName}</p>
                <p className="text-xs text-ink-500">{form.jobTitle || 'Role not specified yet'}</p>
                <div className="w-full mt-4 h-1.5 bg-ink-100 rounded-full overflow-hidden">
                  <div className="h-full bg-brand-600 transition-all" style={{ width: `${completion}%` }} />
                </div>
                <p className="text-[11px] text-ink-400 mt-1.5">{completion}% of wizard completed</p>
              </div>
              <div className="mt-3 border-t border-ink-100 pt-3 space-y-2.5">
                <PreviewRow label="Department" value={departments.find(department => department.id === form.departmentId)?.name || 'Not selected'} />
                <PreviewRow label="Manager" value={managers.find(manager => manager.id === form.managerId) ? fullName(managers.find(manager => manager.id === form.managerId)!) : 'Not assigned'} />
                <PreviewRow label="Compensation" value={form.annualSalary ? `$${Number(form.annualSalary).toLocaleString()}/yr` : 'Not entered'} />
                <PreviewRow label="Required docs" value={`${uploadedRequiredCount}/${requiredDocuments.length} uploaded`} />
              </div>
              <div className="mt-4 border-t border-ink-100 pt-3">
                <p className="text-[11px] font-medium text-ink-500 uppercase tracking-wide mb-2">Up next</p>
                <ul className="space-y-1.5">
                  {steps.slice(step, step + 4).map(item => (
                    <li key={item.id} className="flex items-center gap-2 text-xs text-ink-600">
                      <span className="h-5 w-5 rounded-full bg-ink-100 text-ink-500 flex items-center justify-center text-[10px]">{item.id}</span>
                      {item.label}
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

function PersonalStep({
  form,
  onChange,
}: {
  form: OnboardingDraft;
  onChange: <K extends keyof OnboardingDraft>(key: K, value: OnboardingDraft[K]) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="First Name" required><Input value={form.firstName} onChange={event => onChange('firstName', event.target.value)} placeholder="Adaobi" /></Field>
      <Field label="Last Name" required><Input value={form.lastName} onChange={event => onChange('lastName', event.target.value)} placeholder="Okoye" /></Field>
      <Field label="Email" required><Input value={form.email} onChange={event => onChange('email', event.target.value)} type="email" placeholder="adaobi.okoye@nerithonx.com" /></Field>
      <Field label="Phone" required><Input value={form.phone} onChange={event => onChange('phone', event.target.value)} placeholder="+234 803 123 4567" /></Field>
      <Field label="Date of Birth" required><Input value={form.dateOfBirth} onChange={event => onChange('dateOfBirth', event.target.value)} type="date" /></Field>
      <Field label="Gender">
        <Select value={form.gender} onChange={event => onChange('gender', event.target.value)}>
          <option>Prefer not to say</option>
          <option>Female</option>
          <option>Male</option>
          <option>Non-binary</option>
        </Select>
      </Field>
      <Field label="Country" required>
        <Select value={form.country} onChange={event => onChange('country', event.target.value)}>
          <option>Nigeria</option>
          <option>Kenya</option>
          <option>Ghana</option>
          <option>UK</option>
        </Select>
      </Field>
      <Field label="City" required><Input value={form.city} onChange={event => onChange('city', event.target.value)} placeholder="Lagos" /></Field>
      <Field label="Residential Address" full><Input value={form.residentialAddress} onChange={event => onChange('residentialAddress', event.target.value)} placeholder="10 Adeola Odeku Street, Victoria Island, Lagos" /></Field>
      <Field label="Emergency Contact Name" full><Input value={form.emergencyContactName} onChange={event => onChange('emergencyContactName', event.target.value)} placeholder="Ngozi Okoye" /></Field>
      <Field label="Emergency Contact Phone"><Input value={form.emergencyContactPhone} onChange={event => onChange('emergencyContactPhone', event.target.value)} placeholder="+234 803 999 8888" /></Field>
      <Field label="Relationship">
        <Select value={form.emergencyRelationship} onChange={event => onChange('emergencyRelationship', event.target.value)}>
          <option>Spouse</option>
          <option>Parent</option>
          <option>Sibling</option>
          <option>Guardian</option>
        </Select>
      </Field>
    </div>
  );
}

function EmploymentStep({
  form,
  onChange,
  availableTeams,
  managers,
}: {
  form: OnboardingDraft;
  onChange: <K extends keyof OnboardingDraft>(key: K, value: OnboardingDraft[K]) => void;
  availableTeams: typeof teams;
  managers: typeof seedEmployees;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Job Title" required><Input value={form.jobTitle} onChange={event => onChange('jobTitle', event.target.value)} placeholder="Senior Backend Engineer" /></Field>
      <Field label="Department" required>
        <Select value={form.departmentId} onChange={event => onChange('departmentId', event.target.value)}>
          {departments.map(department => <option key={department.id} value={department.id}>{department.name}</option>)}
        </Select>
      </Field>
      <Field label="Team">
        <Select value={form.teamId} onChange={event => onChange('teamId', event.target.value)}>
          {availableTeams.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
        </Select>
      </Field>
      <Field label="Employment Type" required>
        <Select value={form.employmentType} onChange={event => onChange('employmentType', event.target.value as OnboardingDraft['employmentType'])}>
          <option value="full_time">Full-time</option>
          <option value="contractor">Contractor</option>
          <option value="part_time">Part-time</option>
          <option value="intern">Intern</option>
        </Select>
      </Field>
      <Field label="Reporting Manager" required>
        <Select value={form.managerId} onChange={event => onChange('managerId', event.target.value)}>
          {managers.map(manager => <option key={manager.id} value={manager.id}>{fullName(manager)}</option>)}
        </Select>
      </Field>
      <Field label="Level" required>
        <Select value={form.level} onChange={event => onChange('level', event.target.value)}>
          <option>L1</option>
          <option>L2</option>
          <option>L3</option>
          <option>L4</option>
          <option>L5</option>
          <option>L6</option>
          <option>L7</option>
        </Select>
      </Field>
      <Field label="Start Date" required><Input value={form.startDate} onChange={event => onChange('startDate', event.target.value)} type="date" /></Field>
      <Field label="Work Location">
        <Select value={form.workLocation} onChange={event => onChange('workLocation', event.target.value)}>
          <option>Lagos (HQ)</option>
          <option>Remote - Nigeria</option>
          <option>Remote - Global</option>
          <option>Abuja</option>
        </Select>
      </Field>
      <Field label="Annual Salary (NGN)" required><Input value={form.annualSalary} onChange={event => onChange('annualSalary', event.target.value)} type="number" placeholder="9600000" /></Field>
      <Field label="Probation Period">
        <Select value={form.probationPeriod} onChange={event => onChange('probationPeriod', event.target.value)}>
          <option>3 months</option>
          <option>6 months</option>
          <option>None</option>
        </Select>
      </Field>
    </div>
  );
}

function BankStep({
  form,
  onChange,
}: {
  form: OnboardingDraft;
  onChange: <K extends keyof OnboardingDraft>(key: K, value: OnboardingDraft[K]) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Bank Name" required>
        <Select value={form.bankName} onChange={event => onChange('bankName', event.target.value)}>
          <option>GTBank</option>
          <option>Access Bank</option>
          <option>Zenith Bank</option>
          <option>First Bank</option>
          <option>UBA</option>
          <option>Kuda</option>
          <option>Stanbic IBTC</option>
        </Select>
      </Field>
      <Field label="Account Type">
        <Select value={form.accountType} onChange={event => onChange('accountType', event.target.value)}>
          <option>Savings</option>
          <option>Current</option>
          <option>Domiciliary</option>
        </Select>
      </Field>
      <Field label="Account Name" required full><Input value={form.accountName} onChange={event => onChange('accountName', event.target.value)} placeholder="Adaobi Okoye" /></Field>
      <Field label="Account Number" required><Input value={form.accountNumber} onChange={event => onChange('accountNumber', event.target.value)} placeholder="0123456789" /></Field>
      <Field label="BVN" required><Input value={form.bvn} onChange={event => onChange('bvn', event.target.value)} placeholder="00000000000" /></Field>
      <Field label="Sort Code"><Input value={form.sortCode} onChange={event => onChange('sortCode', event.target.value)} placeholder="058152930" /></Field>
      <Field label="Swift Code"><Input value={form.swiftCode} onChange={event => onChange('swiftCode', event.target.value)} placeholder="GTBINGLA" /></Field>
      <div className="md:col-span-2 p-3 rounded-lg bg-brand-50 border border-brand-100 text-xs text-brand-800">
        Bank account details will be used for monthly salary disbursement via the Payroll module.
      </div>
    </div>
  );
}

function TaxStep({
  form,
  onChange,
}: {
  form: OnboardingDraft;
  onChange: <K extends keyof OnboardingDraft>(key: K, value: OnboardingDraft[K]) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Tax Identification Number (TIN)" required><Input value={form.tin} onChange={event => onChange('tin', event.target.value)} placeholder="12345678-0000" /></Field>
      <Field label="Filing State" required>
        <Select value={form.filingState} onChange={event => onChange('filingState', event.target.value)}>
          <option>Lagos</option>
          <option>FCT - Abuja</option>
          <option>Rivers</option>
          <option>Kano</option>
        </Select>
      </Field>
      <Field label="National Insurance Number (NIN)"><Input value={form.nin} onChange={event => onChange('nin', event.target.value)} placeholder="0000000000" /></Field>
      <Field label="Tax Residency">
        <Select value={form.taxResidency} onChange={event => onChange('taxResidency', event.target.value)}>
          <option>Resident</option>
          <option>Non-resident</option>
        </Select>
      </Field>
      <Field label="NSITF Number" required><Input value={form.nsitfNumber} onChange={event => onChange('nsitfNumber', event.target.value)} placeholder="NSITF-0000000" /></Field>
      <Field label="ITF Number"><Input value={form.itfNumber} onChange={event => onChange('itfNumber', event.target.value)} placeholder="ITF-0000000" /></Field>
      <div className="md:col-span-2 p-3 rounded-lg bg-amber-50 border border-amber-100 text-xs text-amber-800">
        Note: PAYE will be calculated automatically based on state of filing. Default Lagos state tax bands apply.
      </div>
    </div>
  );
}

function PensionStep({
  form,
  onChange,
}: {
  form: OnboardingDraft;
  onChange: <K extends keyof OnboardingDraft>(key: K, value: OnboardingDraft[K]) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Pension Fund Administrator (PFA)" required>
        <Select value={form.pfa} onChange={event => onChange('pfa', event.target.value)}>
          <option>Stanbic IBTC Pension</option>
          <option>ARM Pension</option>
          <option>Legacy Pension</option>
          <option>FCMB Pensions</option>
        </Select>
      </Field>
      <Field label="Pension Account Number" required><Input value={form.pensionAccountNumber} onChange={event => onChange('pensionAccountNumber', event.target.value)} placeholder="PFA-0000000" /></Field>
      <Field label="Employee Contribution"><Input value="8%" disabled /></Field>
      <Field label="Employer Contribution"><Input value="10%" disabled /></Field>
      <Field label="NHF Number" required><Input value={form.nhfNumber} onChange={event => onChange('nhfNumber', event.target.value)} placeholder="NHF-0000000" /></Field>
      <Field label="NHF Contribution"><Input value="2.5%" disabled /></Field>
      <Field label="Health Insurance Provider">
        <Select value={form.healthInsuranceProvider} onChange={event => onChange('healthInsuranceProvider', event.target.value)}>
          <option>AXA Mansard</option>
          <option>Reliance HMO</option>
          <option>Hygeia HMO</option>
        </Select>
      </Field>
      <Field label="Health Plan">
        <Select value={form.healthPlan} onChange={event => onChange('healthPlan', event.target.value)}>
          <option>Family</option>
          <option>Individual</option>
          <option>Parent Plus</option>
        </Select>
      </Field>
      <div className="md:col-span-2 p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-xs text-emerald-800">
        All compliance forms will auto-generate a PDF and be filed in the employee&apos;s Documents tab.
      </div>
    </div>
  );
}

function DocumentsStep({
  uploadedDocuments,
  onToggleDocument,
}: {
  uploadedDocuments: string[];
  onToggleDocument: (name: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-ink-500 mb-3">Upload required documents. Files must be PDF, JPG, or PNG and under 5MB.</p>
      {allDocuments.map(document => {
        const uploaded = uploadedDocuments.includes(document.name);
        return (
          <div key={document.name} className="flex items-center justify-between p-3 rounded-lg border border-ink-200 hover:bg-ink-50/50">
            <div className="flex items-center gap-3">
              <span className="h-9 w-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center"><FileText className="h-4 w-4" /></span>
              <div>
                <p className="text-sm font-medium text-ink-900">{document.name} {document.required && <span className="text-red-500">*</span>}</p>
                <p className="text-[11px] text-ink-500">{uploaded ? 'Uploaded to mock record' : document.required ? 'Required' : 'Optional'}</p>
              </div>
            </div>
            <Button variant={uploaded ? 'secondary' : 'outline'} size="sm" onClick={() => onToggleDocument(document.name)}>
              {uploaded ? 'Uploaded' : 'Upload'}
            </Button>
          </div>
        );
      })}
    </div>
  );
}

function ReviewStep({
  form,
  onChange,
  onEditStep,
}: {
  form: OnboardingDraft;
  onChange: <K extends keyof OnboardingDraft>(key: K, value: OnboardingDraft[K]) => void;
  onEditStep: (step: number) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100 flex items-start gap-3">
        <Sparkles className="h-4 w-4 text-emerald-600 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-emerald-900">Ready to submit</p>
          <p className="text-xs text-emerald-700 mt-0.5">Submitting will create the employee in mock state, add a notification, and make the record immediately available in directory and detail views.</p>
        </div>
      </div>
      <ReviewSection
        title="Personal"
        onEdit={() => onEditStep(1)}
        rows={[
          ['Name', `${form.firstName} ${form.lastName}`.trim() || 'Not entered'],
          ['Email', form.email || 'Not entered'],
          ['Phone', form.phone || 'Not entered'],
          ['Location', `${form.city}, ${form.country}`.replace(/^,\s*/, '') || 'Not entered'],
        ]}
      />
      <ReviewSection
        title="Employment"
        onEdit={() => onEditStep(2)}
        rows={[
          ['Job Title', form.jobTitle || 'Not entered'],
          ['Department', departments.find(department => department.id === form.departmentId)?.name || 'Not selected'],
          ['Manager', seedEmployees.find(employee => employee.id === form.managerId) ? fullName(seedEmployees.find(employee => employee.id === form.managerId)!) : 'Not assigned'],
          ['Level', form.level || 'Not selected'],
          ['Salary', form.annualSalary ? `$${Number(form.annualSalary).toLocaleString()}/yr` : 'Not entered'],
          ['Start Date', form.startDate || 'Not entered'],
        ]}
      />
      <ReviewSection
        title="Banking"
        onEdit={() => onEditStep(3)}
        rows={[
          ['Bank', form.bankName || 'Not entered'],
          ['Account', form.accountNumber || 'Not entered'],
          ['Type', form.accountType || 'Not entered'],
        ]}
      />
      <ReviewSection
        title="Tax & Compliance"
        onEdit={() => onEditStep(4)}
        rows={[
          ['TIN', form.tin || 'Not entered'],
          ['Filing State', form.filingState || 'Not entered'],
          ['NSITF', form.nsitfNumber || 'Not entered'],
          ['Pension PFA', form.pfa || 'Not entered'],
          ['NHF', form.nhfNumber || 'Not entered'],
        ]}
      />
      <ReviewSection
        title="Documents"
        onEdit={() => onEditStep(6)}
        rows={[
          ['Uploaded', `${form.uploadedDocuments.length} documents`],
          ['Required complete', requiredDocuments.every(name => form.uploadedDocuments.includes(name)) ? 'Yes' : 'No'],
        ]}
      />
      <label className="flex items-start gap-2 mt-4 cursor-pointer">
        <input
          type="checkbox"
          checked={form.confirmed}
          onChange={event => onChange('confirmed', event.target.checked)}
          className="mt-0.5"
        />
        <span className="text-xs text-ink-600">I confirm all information provided is accurate. Onboarding checklist will begin immediately upon submission.</span>
      </label>
    </div>
  );
}

function ReviewSection({
  title,
  rows,
  onEdit,
}: {
  title: string;
  rows: [string, string][];
  onEdit: () => void;
}) {
  return (
    <div className="border border-ink-200 rounded-lg overflow-hidden">
      <div className="px-4 py-2 bg-ink-50 border-b border-ink-200 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-700">{title}</p>
        <Button variant="ghost" size="xs" onClick={onEdit}>Edit</Button>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 px-4 py-3">
        {rows.map(([key, value]) => (
          <div key={key}>
            <p className="text-[11px] text-ink-500">{key}</p>
            <p className="text-sm text-ink-900">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-ink-500">{label}</span>
      <span className="text-right text-ink-900 font-medium">{value}</span>
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

export function OnboardingChecklistPage({ navigate }: RouteProps) {
  const { employees } = useMockData();
  const inProgress = employees.filter(employee => employee.status === 'probation').slice(0, 8);

  return (
    <div>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: 'Onboarding' }, { label: 'Checklists' }]} />}
        title="New Hire Checklists"
        description={`${inProgress.length} employees currently onboarding`}
        actions={<Button size="sm" leftIcon={<Sparkles className="h-3.5 w-3.5" />} onClick={() => navigate('/onboarding/wizard')}>Start New Onboarding</Button>}
      />
      <div className="p-6 space-y-3">
        {inProgress.map(employee => {
          const stepIndex = Math.floor((employee.onboardingProgress || 0) / 11);
          const nextStep = onboardingSteps[Math.min(stepIndex, onboardingSteps.length - 1)];
          const department = departments.find(item => item.id === employee.departmentId);
          return (
            <Card key={employee.id} className="hover:shadow-cardlg cursor-pointer">
              <div className="p-4 flex items-center gap-4" onClick={() => navigate(`/employees/${employee.id}`)}>
                <Avatar name={fullName(employee)} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink-900">{fullName(employee)}</p>
                  <p className="text-[11px] text-ink-500">{employee.jobTitle} • {department?.name}</p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-3">
                  <Clock className="h-3.5 w-3.5 text-ink-400" />
                  <span className="text-xs text-ink-500">Next: {nextStep?.title}</span>
                </div>
                <div className="w-32">
                  <div className="h-1.5 bg-ink-100 rounded-full overflow-hidden">
                    <div className={`h-full ${employee.onboardingProgress === 100 ? 'bg-emerald-500' : 'bg-brand-600'} transition-all`} style={{ width: `${employee.onboardingProgress}%` }} />
                  </div>
                  <p className="text-[11px] text-ink-400 mt-0.5">{employee.onboardingProgress}% complete</p>
                </div>
                <Badge tone={employee.onboardingProgress === 100 ? 'green' : 'amber'} dot>{employee.onboardingProgress === 100 ? 'Ready' : 'In Progress'}</Badge>
              </div>
            </Card>
          );
        })}
        {inProgress.length === 0 && (
          <Card>
            <CardBody className="text-center py-10">
              <p className="text-sm font-medium text-ink-900">No active onboarding flows</p>
              <p className="text-xs text-ink-500 mt-1">Start a new onboarding run to provision an employee into the mock environment.</p>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}
