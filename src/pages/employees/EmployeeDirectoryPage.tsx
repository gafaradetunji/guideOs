import { useState, useMemo } from 'react';
import { Search, Download, UserPlus, MoreHorizontal, Filter, Users, ChevronDown } from 'lucide-react';
import { PageHeader, Breadcrumbs, Card, Avatar, Button, Input, Table, THead, Th, TBody, Tr, Td, EmptyState } from '../../components/ui';
import { FilterSelect, Checkbox, StatusBadge, Pagination } from '../../components/ui/Filters';
import { departments, teams, fullName, formatDate, type Employee } from '../../data/seed';
import { useMockData } from '../../mock/MockDataProvider';
import type { RouteProps } from '../../lib/types';

const PAGE_SIZE = 12;

export function EmployeeDirectoryPage({ navigate }: RouteProps) {
  const { employees } = useMockData();
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const countries = Array.from(new Set(employees.map(e => e.country)));

  const filtered = useMemo(() => {
    return employees.filter(e => {
      if (search && !fullName(e).toLowerCase().includes(search.toLowerCase()) && !e.email.toLowerCase().includes(search.toLowerCase()) && !e.jobTitle.toLowerCase().includes(search.toLowerCase())) return false;
      if (deptFilter && e.departmentId !== deptFilter) return false;
      if (statusFilter && e.status !== statusFilter) return false;
      if (typeFilter && e.employmentType !== typeFilter) return false;
      if (countryFilter && e.country !== countryFilter) return false;
      return true;
    });
  }, [search, deptFilter, statusFilter, typeFilter, countryFilter]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const allOnPageSelected = paged.length > 0 && paged.every(e => selected.has(e.id));
  const someSelected = selected.size > 0;

  function toggleSelectAll() {
    const next = new Set(selected);
    if (allOnPageSelected) {
      paged.forEach(e => next.delete(e.id));
    } else {
      paged.forEach(e => next.add(e.id));
    }
    setSelected(next);
  }

  function toggleSelect(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  }

  return (
    <div>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: 'Employees' }, { label: 'Directory' }]} />}
        title="Employee Directory"
        description={`${filtered.length} employees across ${departments.length} departments`}
        actions={
          <>
            <Button variant="outline" size="sm" leftIcon={<Download className="h-3.5 w-3.5" />}>Export</Button>
            <Button size="sm" leftIcon={<UserPlus className="h-3.5 w-3.5" />} onClick={() => navigate('/onboarding')}>Add Employee</Button>
          </>
        }
      />

      {/* Toolbar */}
      <div className="px-5 py-3 border-b border-ink-200 bg-white flex flex-wrap items-center gap-2 sticky top-0 z-10">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <Input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search employees..." className="pl-9" />
        </div>
        <FilterSelect label="Dept" value={deptFilter} onChange={(v) => { setDeptFilter(v); setPage(1); }} options={departments.map(d => ({ value: d.id, label: d.name }))} />
        <FilterSelect label="Status" value={statusFilter} onChange={v => { setStatusFilter(v); setPage(1); }} options={[{value:'active',label:'Active'},{value:'on_leave',label:'On Leave'},{value:'probation',label:'Probation'},{value:'inactive',label:'Inactive'}]} />
        <FilterSelect label="Type" value={typeFilter} onChange={v => { setTypeFilter(v); setPage(1); }} options={[{value:'full_time',label:'Full-time'},{value:'contractor',label:'Contractor'},{value:'part_time',label:'Part-time'},{value:'intern',label:'Intern'}]} />
        <FilterSelect label="Country" value={countryFilter} onChange={v => { setCountryFilter(v); setPage(1); }} options={countries.map(c => ({ value: c, label: c }))} />
        {(search || deptFilter || statusFilter || typeFilter || countryFilter) && (
          <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setDeptFilter(''); setStatusFilter(''); setTypeFilter(''); setCountryFilter(''); }}>Clear</Button>
        )}
      </div>

      {/* Bulk action bar */}
      {someSelected && (
        <div className="px-5 py-2.5 bg-brand-50 border-b border-brand-100 flex items-center gap-3">
          <span className="text-xs font-medium text-brand-700">{selected.size} selected</span>
          <Button variant="outline" size="xs">Assign Manager</Button>
          <Button variant="outline" size="xs">Export</Button>
          <Button variant="outline" size="xs">Move Department</Button>
          <Button variant="danger" size="xs">Deactivate</Button>
          <button onClick={() => setSelected(new Set())} className="text-xs text-ink-500 hover:text-ink-900 ml-auto">Clear</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white">
        {paged.length === 0 ? (
          <EmptyState icon={<Users className="h-6 w-6" />} title="No employees found" description="Try adjusting your filters or search query." action={<Button size="sm" onClick={() => { setSearch(''); setDeptFilter(''); setStatusFilter(''); }}>Reset filters</Button>} />
        ) : (
          <Table>
            <THead>
              <tr>
                <th className="w-10"><Checkbox checked={allOnPageSelected} indeterminate={someSelected && !allOnPageSelected} onChange={toggleSelectAll} /></th>
                <Th>Employee</Th>
                <Th>Job Title</Th>
                <Th>Department</Th>
                <Th>Location</Th>
                <Th>Status</Th>
                <Th>Start Date</Th>
                <th className="w-10" />
              </tr>
            </THead>
            <TBody>
              {paged.map((e: Employee) => {
                const dept = departments.find(d => d.id === e.departmentId);
                const isSel = selected.has(e.id);
                return (
                  <Tr key={e.id} onClick={() => navigate(`/employees/${e.id}`)}>
                    <Td>
                      <div onClick={e2 => e2.stopPropagation()}><Checkbox checked={isSel} onChange={() => toggleSelect(e.id)} /></div>
                    </Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        <Avatar name={fullName(e)} size={32} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-ink-900">{fullName(e)}</p>
                          <p className="text-[11px] text-ink-500">{e.email}</p>
                        </div>
                      </div>
                    </Td>
                    <Td className="text-sm">{e.jobTitle}</Td>
                    <Td>
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full" style={{ background: dept?.color }} />
                        <span className="text-sm">{dept?.name}</span>
                      </span>
                    </Td>
                    <Td><span className="text-sm">{e.location}, {e.country}</span></Td>
                    <Td><StatusBadge status={e.status} /></Td>
                    <Td className="text-sm text-ink-500">{formatDate(e.startDate)}</Td>
                    <Td>
                      <button onClick={(ev) => ev.stopPropagation()} className="h-7 w-7 rounded-md hover:bg-ink-100 flex items-center justify-center text-ink-400">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </Td>
                  </Tr>
                );
              })}
            </TBody>
          </Table>
        )}
        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
      </div>
    </div>
  );
}

export function DepartmentsPage({ navigate }: RouteProps) {
  const { employees } = useMockData();
  return (
    <div>
      <PageHeader
        breadcrumbs={<Breadcrumbs items={[{ label: 'Employees', onClick: () => navigate('/employees') }, { label: 'Departments' }]} />}
        title="Departments"
        description={`${departments.length} departments across the organization`}
        actions={<Button size="sm" variant="outline" leftIcon={<UserPlus className="h-3.5 w-3.5" />}>New Department</Button>}
      />
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map(d => {
          const lead = employees.find(e => e.id === d.leadId);
          const teamCount = teamsFor(d.id).length;
          return (
            <Card key={d.id} className="hover:shadow-cardlg hover:border-ink-300 transition-all cursor-pointer" onClick={() => navigate('/employees')}>
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white" style={{ background: d.color }}>
                    <span className="font-semibold text-sm">{d.name.charAt(0)}</span>
                  </div>
                  <span className="text-xs text-ink-500">{d.headcount} people</span>
                </div>
                <h3 className="text-base font-semibold text-ink-900">{d.name}</h3>
                <p className="text-xs text-ink-500 mt-1 leading-relaxed">{d.description}</p>
                <div className="mt-4 pt-3 border-t border-ink-100 flex items-center gap-2">
                  {lead && <Avatar name={fullName(lead)} size={24} />}
                  <div className="min-w-0">
                    <p className="text-[11px] text-ink-500">Department Lead</p>
                    <p className="text-xs font-medium text-ink-900 truncate">{lead ? fullName(lead) : 'Unassigned'}</p>
                  </div>
                  <span className="ml-auto text-[11px] text-ink-400 bg-ink-100 px-2 py-0.5 rounded-md">{teamCount} teams</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function teamsFor(deptId: string) {
  return teams.filter(t => t.departmentId === deptId);
}
