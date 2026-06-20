import { useState } from 'react';
import { Search, Plus, MoreHorizontal, Mail, Phone, Building2, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { PageHeader, Breadcrumbs, Card, CardHeader, CardBody, Avatar, Button, Input, Table, THead, Th, TBody, Tr, Td, EmptyState } from '../../components/ui';
import { FilterSelect, StatusBadge, ProgressBar, Checkbox } from '../../components/ui/Filters';
import { Drawer } from '../../components/ui/Overlays';
import { leads, opportunities, customers, fullName, formatCurrency, formatDate, relativeTime } from '../../data/seed';
import type { RouteProps } from '../../lib/types';

export function LeadsPage({ navigate }: RouteProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [drawerLead, setDrawerLead] = useState<typeof leads[0] | null>(null);
  const filtered = leads.filter(l => {
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.company.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && l.status !== statusFilter) return false;
    if (sourceFilter && l.source !== sourceFilter) return false;
    return true;
  });
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'CRM', onClick: () => navigate('/crm/leads') }, { label: 'Leads' }]} />} title="Leads" description={`${filtered.length} leads in your pipeline`} actions={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>Add Lead</Button>} />
      <div className="px-5 py-3 border-b border-ink-200 bg-white flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..." className="pl-9" />
        </div>
        <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={[{value:'new',label:'New'},{value:'contacted',label:'Contacted'},{value:'qualified',label:'Qualified'},{value:'unqualified',label:'Unqualified'}]} />
        <FilterSelect label="Source" value={sourceFilter} onChange={setSourceFilter} options={['Website','Referral','LinkedIn','Cold Email','Trade Show','Webinar'].map(s => ({value:s,label:s}))} />
      </div>
      <div className="bg-white">
        {filtered.length === 0 ? (
          <EmptyState icon={<Search className="h-6 w-6" />} title="No leads found" description="Try adjusting filters or add a new lead." />
        ) : (
          <Table>
            <THead><tr><Th>Lead</Th><Th>Company</Th><Th>Source</Th><Th>Status</Th><Th>Value</Th><Th>Owner</Th><Th>Last Activity</Th><th /></tr></THead>
            <TBody>
              {filtered.map(l => (
                <Tr key={l.id} onClick={() => setDrawerLead(l)}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <Avatar name={l.name} size={32} />
                      <div><p className="text-sm font-medium text-ink-900">{l.name}</p><p className="text-[11px] text-ink-500">{l.email}</p></div>
                    </div>
                  </Td>
                  <Td className="text-sm">{l.company}</Td>
                  <Td className="text-sm text-ink-500">{l.source}</Td>
                  <Td><StatusBadge status={l.status} /></Td>
                  <Td className="text-sm font-medium">{formatCurrency(l.value)}</Td>
                  <Td className="text-sm">{l.owner}</Td>
                  <Td className="text-sm text-ink-500">{relativeTime(l.lastActivityAt)}</Td>
                  <Td><button className="h-7 w-7 rounded-md hover:bg-ink-100 flex items-center justify-center text-ink-400"><MoreHorizontal className="h-4 w-4" /></button></Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        )}
      </div>
      <LeadDrawer lead={drawerLead} onClose={() => setDrawerLead(null)} />
    </div>
  );
}

function LeadDrawer({ lead, onClose }: { lead: typeof leads[0] | null; onClose: () => void }) {
  return (
    <Drawer open={!!lead} onClose={onClose} title={lead?.name} description={lead?.company} footer={<><Button variant="ghost" size="sm" onClick={onClose}>Close</Button><Button size="sm">Convert to Contact</Button></>}>
      {lead && (
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-ink-100">
            <Avatar name={lead.name} size={48} />
            <div>
              <p className="text-base font-semibold text-ink-900">{lead.name}</p>
              <StatusBadge status={lead.status} />
            </div>
          </div>
          <div className="space-y-2.5">
            <DetailItem icon={<Mail className="h-3.5 w-3.5" />} label="Email" value={lead.email} />
            <DetailItem icon={<Phone className="h-3.5 w-3.5" />} label="Phone" value={lead.phone} />
            <DetailItem icon={<Building2 className="h-3.5 w-3.5" />} label="Company" value={lead.company} />
            <DetailItem icon={<Filter className="h-3.5 w-3.5" />} label="Source" value={lead.source} />
            <DetailItem label="Est. Value" value={formatCurrency(lead.value)} />
            <DetailItem label="Owner" value={lead.owner} />
          </div>
        </div>
      )}
    </Drawer>
  );
}

function DetailItem({ icon, label, value }: { icon?: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 py-2 border-b border-ink-100 last:border-0">
      <span className="flex items-center gap-2 text-xs text-ink-500">{icon}{label}</span>
      <span className="text-sm text-ink-900 text-right">{value}</span>
    </div>
  );
}

const STAGES = ['prospecting','qualification','proposal','negotiation','closed_won','closed_lost'] as const;

export function OpportunitiesPage({ navigate }: RouteProps) {
  const [view, setView] = useState<'pipeline' | 'table'>('pipeline');
  const total = opportunities.reduce((a, o) => a + o.value, 0);
  const won = opportunities.filter(o => o.stage === 'closed_won').reduce((a, o) => a + o.value, 0);

  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'CRM', onClick: () => navigate('/crm/opportunities') }, { label: 'Opportunities' }]} />} title="Opportunities" description={`${opportunities.length} deals worth ${formatCurrency(total)} • ${formatCurrency(won)} won`} actions={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>Add Opportunity</Button>} />
      <div className="px-5 py-2 border-b border-ink-200 bg-white flex items-center gap-1">
        <button onClick={() => setView('pipeline')} className={view === 'pipeline' ? 'px-3 py-1.5 text-xs font-medium rounded-md bg-ink-900 text-white' : 'px-3 py-1.5 text-xs text-ink-600 hover:bg-ink-100 rounded-md'}>Pipeline</button>
        <button onClick={() => setView('table')} className={view === 'table' ? 'px-3 py-1.5 text-xs font-medium rounded-md bg-ink-900 text-white' : 'px-3 py-1.5 text-xs text-ink-600 hover:bg-ink-100 rounded-md'}>Table</button>
      </div>
      {view === 'pipeline' ? (
        <div className="p-4 overflow-x-auto scrollbar-thin">
          <div className="flex gap-3 min-w-max">
            {STAGES.map(stage => {
              const deals = opportunities.filter(o => o.stage === stage);
              const total = deals.reduce((a, o) => a + o.value, 0);
              return (
                <div key={stage} className="w-72 flex-shrink-0">
                  <div className="flex items-center justify-between mb-2 px-2">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={stage} />
                      <span className="text-xs text-ink-400">{deals.length}</span>
                    </div>
                    <span className="text-xs font-medium text-ink-600">{formatCurrency(total)}</span>
                  </div>
                  <div className="space-y-2">
                    {deals.map(o => (
                      <Card key={o.id} className="hover:shadow-cardlg cursor-pointer border-ink-200">
                        <div className="p-3">
                          <p className="text-sm font-medium text-ink-900 truncate">{o.name}</p>
                          <p className="text-[11px] text-ink-500 truncate">{o.company}</p>
                          <p className="text-sm font-semibold text-ink-900 mt-2">{formatCurrency(o.value)}</p>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-[11px] text-ink-400">{o.contactName}</span>
                            <span className="text-[11px] text-ink-400">{formatDate(o.closeDate)}</span>
                          </div>
                          <div className="mt-2"><ProgressBar value={o.probability} tone={stage === 'closed_lost' ? 'red' : 'brand'} /></div>
                        </div>
                      </Card>
                    ))}
                    {deals.length === 0 && <p className="text-xs text-ink-400 text-center py-4">No deals</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white">
          <Table>
            <THead><tr><Th>Opportunity</Th><Th>Company</Th><Th>Stage</Th><Th>Value</Th><Th>Owner</Th><Th>Close Date</Th></tr></THead>
            <TBody>
              {opportunities.map(o => (
                <Tr key={o.id}>
                  <Td><div><p className="text-sm font-medium text-ink-900">{o.name}</p><p className="text-[11px] text-ink-500">{o.contactName}</p></div></Td>
                  <Td className="text-sm">{o.company}</Td>
                  <Td><StatusBadge status={o.stage} /></Td>
                  <Td className="text-sm font-medium">{formatCurrency(o.value)}</Td>
                  <Td className="text-sm">{o.owner}</Td>
                  <Td className="text-sm text-ink-500">{formatDate(o.closeDate)}</Td>
                </Tr>
              ))}
            </TBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export function CompaniesPage({ navigate }: RouteProps) {
  const companies = Array.from(new Set([...leads, ...opportunities, ...customers].map(o => o.company))).slice(0, 16);
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'CRM', onClick: () => navigate('/crm/companies') }, { label: 'Companies' }]} />} title="Companies" description={`${companies.length} companies`} actions={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>Add Company</Button>} />
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {companies.map((name, i) => {
          const deals = opportunities.filter(o => o.company === name);
          const value = deals.reduce((a, o) => a + o.value, 0);
          return (
            <Card key={name} className="hover:shadow-cardlg cursor-pointer">
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink-900 truncate">{name}</p>
                    <p className="text-[11px] text-ink-500">{deals.length} deals</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-ink-500">Pipeline value</span><span className="font-medium text-ink-900">{formatCurrency(value)}</span></div>
                  <div className="flex justify-between"><span className="text-ink-500">Open deals</span><span className="font-medium text-ink-900">{deals.filter(d => d.stage !== 'closed_won' && d.stage !== 'closed_lost').length}</span></div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function ContactsPage({ navigate }: RouteProps) {
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'CRM', onClick: () => navigate('/crm/contacts') }, { label: 'Contacts' }]} />} title="Contacts" description={`${leads.length} contacts in your address book`} actions={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>Add Contact</Button>} />
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {leads.map(c => (
          <Card key={c.id} className="hover:shadow-cardlg">
            <div className="p-4 flex items-center gap-3">
              <Avatar name={c.name} size={40} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink-900 truncate">{c.name}</p>
                <p className="text-[11px] text-ink-500 truncate">{c.company}</p>
                <p className="text-[11px] text-ink-500 truncate">{c.email}</p>
              </div>
              <StatusBadge status={c.status} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function PipelinesPage({ navigate }: RouteProps) {
  return (
    <div>
      <PageHeader breadcrumbs={<Breadcrumbs items={[{ label: 'CRM', onClick: () => navigate('/crm/pipelines') }, { label: 'Pipelines' }]} />} title="Pipelines" description="Configure your sales pipeline stages" actions={<Button size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>New Pipeline</Button>} />
      <div className="p-6 space-y-4">
        <Card>
          <CardHeader title="Default Sales Pipeline" subtitle="6 stages • 22 active deals" action={<Button variant="ghost" size="sm">Edit Stages</Button>} />
          <CardBody className="p-0">
            <div className="flex items-center text-center border-t border-ink-100">
              {STAGES.map((s, i) => {
                const deals = opportunities.filter(o => o.stage === s);
                return (
                  <div key={s} className="flex-1 p-4 border-r last:border-0 border-ink-100">
                    <StatusBadge status={s} />
                    <p className="text-2xl font-semibold text-ink-900 mt-2">{deals.length}</p>
                    <p className="text-[11px] text-ink-500">{formatCurrency(deals.reduce((a, o) => a + o.value, 0))}</p>
                    <p className="text-[10px] text-ink-400 mt-1">Stage {i+1}</p>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
