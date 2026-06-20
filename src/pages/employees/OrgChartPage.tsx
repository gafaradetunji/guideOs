import { PageHeader, Breadcrumbs, Card, Avatar } from '../../components/ui';
import { employees, departments, fullName } from '../../data/seed';
import type { RouteProps } from '../../lib/types';

export function OrgChartPage({ navigate }: RouteProps) {
  const ceo = employees.find(e => e.id === 'e-001')!;
  const directReports = employees.filter(e => e.managerId === ceo.id).slice(0, 8);
  const deptLeads = departments.slice(0, 8).map(d => ({ dept: d, lead: employees.find(e => e.id === d.leadId) })).filter(x => x.lead);

  return (
    <div>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: 'Employees', onClick: () => navigate('/employees') }, { label: 'Org Chart' }]} />}
        title="Organization Chart"
        description="Reporting structure across GuideOS"
      />
      <div className="p-6 overflow-x-auto scrollbar-thin">
        <div className="min-w-[900px]">
          {/* CEO */}
          <div className="flex flex-col items-center">
            <OrgNode name={fullName(ceo)} title={ceo.jobTitle} dept="Executive" onClick={() => navigate(`/employees/${ceo.id}`)} highlight />
            <div className="h-10 w-px bg-ink-200" />
            <div className="w-full h-px bg-ink-200" />
          </div>

          {/* Level 2 - direct reports */}
          <div className="grid gap-6 grid-cols-4 mt-0">
            {directReports.map((e, i) => {
              const dept = departments.find(d => d.id === e.departmentId);
              const reports = employees.filter(x => x.managerId === e.id).slice(0, 4);
              return (
                <div key={e.id} className="flex flex-col items-center">
                  <div className="h-10 w-px bg-ink-200" />
                  <OrgNode name={fullName(e)} title={e.jobTitle} dept={dept?.name || ''} onClick={() => navigate(`/employees/${e.id}`)} accent={dept?.color} />
                  {reports.length > 0 && (
                    <>
                      <div className="h-8 w-px bg-ink-200" />
                      <div className="space-y-3 w-full">
                        {reports.map(r => (
                          <div key={r.id} className="flex justify-center">
                            <OrgNode name={fullName(r)} title={r.jobTitle} dept="" small onClick={() => navigate(`/employees/${r.id}`)} />
                          </div>
                        ))}
                        {employees.filter(x => x.managerId === e.id).length > 4 && (
                          <div className="text-center text-[11px] text-ink-400">+{employees.filter(x => x.managerId === e.id).length - 4} more</div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Department quick view */}
        <div className="mt-10">
          <h3 className="text-sm font-semibold text-ink-900 mb-3">Department Leads</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {deptLeads.map(({ dept, lead }) => (
              <Card key={dept.id} className="hover:shadow-cardlg cursor-pointer" >
                <div className="p-4 flex items-center gap-3" onClick={() => navigate(`/employees/${lead!.id}`)}>
                  <Avatar name={fullName(lead!)} size={36} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-900 truncate">{fullName(lead!)}</p>
                    <p className="text-[11px] text-ink-500 truncate">{dept.name} • {dept.headcount} people</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrgNode({ name, title, dept, small = false, highlight = false, accent, onClick }: { name: string; title: string; dept: string; small?: boolean; highlight?: boolean; accent?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className={[
      'bg-white border rounded-lg shadow-card hover:shadow-cardlg hover:border-brand-300 transition-all flex flex-col items-center text-center px-4',
      small ? 'py-2 max-w-[180px]' : 'py-3 max-w-[220px]',
      highlight ? 'border-brand-400 ring-2 ring-brand-100' : 'border-ink-200',
    ].join(' ')}>
      <Avatar name={name} size={small ? 28 : 40} />
      <p className={['font-medium text-ink-900 mt-2 truncate w-full', small ? 'text-xs' : 'text-sm'].join(' ')}>{name}</p>
      <p className="text-[11px] text-ink-500 truncate w-full">{title}</p>
      {dept && !small && <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-ink-500"><span className="h-1.5 w-1.5 rounded-full" style={{ background: accent || '#8b91a3' }} />{dept}</span>}
    </button>
  );
}
