import { ChevronDown, Search, Bell, Plus, HelpCircle, Settings2, ChevronRight, Activity, ShieldCheck, Command } from 'lucide-react';
import { navSections, routeCount } from '../../config/nav';
import { Avatar } from '../ui';

interface SidebarProps {
  path: string;
  onNavigate: (to: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ path, onNavigate, collapsed, onToggleCollapse }: SidebarProps) {
  const activeRoot = path;
  return (
    <aside
      className={[
        'flex flex-col text-ink-100 border-r transition-all duration-200 flex-shrink-0',
        'bg-[linear-gradient(180deg,#081120_0%,#0b172a_55%,#0d1a2f_100%)] border-white/10 shadow-[inset_-1px_0_0_rgba(255,255,255,0.05)]',
        collapsed ? 'w-16' : 'w-72',
      ].join(' ')}
    >
      <div className="h-16 flex items-center px-3 border-b border-white/10">
        <div className="h-9 w-9 rounded-md bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0 shadow-sm ring-1 ring-white/10">
          <Command className="h-4 w-4 text-white" />
        </div>
        {!collapsed && (
          <div className="ml-3 min-w-0">
            <p className="text-[13px] font-semibold text-white leading-tight">GuideOS Control Plane</p>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.14em]">NerithonX / Production</p>
          </div>
        )}
        {!collapsed && (
          <button onClick={onToggleCollapse} className="ml-auto text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/5" aria-label="Collapse sidebar">
            <ChevronRight className="h-4 w-4 rotate-180" />
          </button>
        )}
      </div>

      {!collapsed && (
        <div className="px-3 py-3 border-b border-white/10">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-slate-400">Workspace</span>
              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[10px] font-mono uppercase tracking-[0.08em] text-emerald-300">
                <Activity className="h-3 w-3" /> Healthy
              </span>
            </div>
            <p className="mt-2 text-sm font-semibold text-white">NerithonX Operations</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
              <div className="rounded-lg border border-white/10 bg-black/10 px-2.5 py-2">
                <p className="font-mono uppercase tracking-[0.08em] text-slate-400">Modules</p>
                <p className="mt-1 text-base font-semibold text-white">{navSections.length}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/10 px-2.5 py-2">
                <p className="font-mono uppercase tracking-[0.08em] text-slate-400">Routes</p>
                <p className="mt-1 text-base font-semibold text-white">{routeCount}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto scrollbar-thin py-2">
        {collapsed && (
          <button onClick={onToggleCollapse} className="w-full flex justify-center text-slate-400 hover:text-white p-2 mb-1" aria-label="Expand sidebar">
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
        {navSections.map(section => (
          <div key={section.id} className="px-2 mb-2">
            {!collapsed && (
              <div className="px-2 py-1.5 flex items-center justify-between">
                <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-slate-500">{section.label}</p>
                <span className="text-[10px] font-mono text-slate-600">{section.items.length}</span>
              </div>
            )}
            <div className="space-y-0.5">
              {section.items.map(item => {
                const on = isActive(activeRoot, item.path);
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.path)}
                    title={collapsed ? item.label : undefined}
                    className={[
                      'w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] transition-colors group',
                      collapsed ? 'justify-center' : '',
                      on ? 'bg-brand-500/15 text-white ring-1 ring-brand-400/20' : 'text-slate-300 hover:bg-white/[0.04] hover:text-white',
                    ].join(' ')}
                  >
                    <span className={on ? 'text-brand-300' : 'text-slate-500 group-hover:text-slate-200'}>{item.icon}</span>
                    {!collapsed && <span className="truncate text-left flex-1">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="ml-auto inline-flex items-center justify-center min-w-[18px] h-4 px-1 text-[10px] font-mono rounded-md bg-emerald-400/15 text-emerald-300">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-2">
        {!collapsed && (
          <div className="mb-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2">
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.08em] text-slate-400">
              <span>Access</span>
              <span className="inline-flex items-center gap-1 text-emerald-300"><ShieldCheck className="h-3 w-3" /> RBAC Active</span>
            </div>
          </div>
        )}
        <button className={['w-full flex items-center gap-2 p-2 rounded-md hover:bg-white/[0.04] transition-colors', collapsed ? 'justify-center' : ''].join(' ')}>
          <Avatar name="Fatima Ibrahim" size={28} />
          {!collapsed && (
            <div className="text-left min-w-0 flex-1">
              <p className="text-xs font-medium text-white truncate">Fatima Ibrahim</p>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.08em] truncate">Super Admin</p>
            </div>
          )}
          {!collapsed && <ChevronDown className="h-3.5 w-3.5 text-slate-400" />}
        </button>
      </div>
    </aside>
  );
}

function isActive(current: string, target: string) {
  if (target === '/') return current === '/';
  if (target === '/employees' && current === '/employees') return true;
  return current === target || current.startsWith(target + '/');
}

interface HeaderProps {
  path: string;
  onNavigate: (to: string) => void;
}

export function Header({ path, onNavigate }: HeaderProps) {
  const crumbs = buildBreadcrumbs(path);
  const currentLabel = crumbs[crumbs.length - 1]?.label ?? 'Dashboard';

  return (
    <header className="h-16 flex-shrink-0 panel-sheen bg-white/80 border-b border-ink-200/80 flex items-center gap-4 px-4 lg:px-6">
      <div className="hidden lg:block min-w-[200px]">
        <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-ink-500">Active Surface</p>
        <p className="text-sm font-semibold text-ink-900 mt-1">{currentLabel}</p>
      </div>

      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input
            placeholder="Search objects, queues, tickets, records..."
            className="h-10 w-full rounded-md border border-ink-300 bg-white/90 pl-9 pr-16 text-sm placeholder:text-ink-400 shadow-sm focus:bg-white focus-ring"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-ink-400 bg-white border border-ink-200 rounded px-1.5 py-0.5">CMD+K</kbd>
        </div>
      </div>

      <div className="hidden xl:flex items-center text-xs text-ink-500 gap-1.5 ml-2 flex-1">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3 text-ink-300" />}
            <button onClick={() => onNavigate(c.path)} className="hover:text-ink-900 transition-colors">{c.label}</button>
          </span>
        ))}
      </div>

      <div className="flex items-center gap-1.5 ml-auto">
        <span className="hidden lg:inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-2 text-[10px] font-mono uppercase tracking-[0.08em] text-emerald-700">
          <Activity className="h-3 w-3" /> Sync Healthy
        </span>
        <button onClick={() => onNavigate('/onboarding')} className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-ink-900 bg-ink-900 hover:bg-ink-800 text-white text-sm font-medium transition-colors">
          <Plus className="h-3.5 w-3.5" /> Provision User
        </button>
        <button onClick={() => onNavigate('/notifications')} className="relative h-9 w-9 rounded-md flex items-center justify-center text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition-colors" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent-500 ring-2 ring-white" />
        </button>
        <button className="h-9 w-9 rounded-md flex items-center justify-center text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition-colors" aria-label="Help">
          <HelpCircle className="h-4 w-4" />
        </button>
        <button onClick={() => onNavigate('/settings')} className="h-9 w-9 rounded-md flex items-center justify-center text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition-colors" aria-label="Settings">
          <Settings2 className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

function buildBreadcrumbs(path: string): { label: string; path: string }[] {
  const segments = path.split('/').filter(Boolean);
  if (segments.length === 0) return [{ label: 'Dashboard', path: '/' }];
  const crumbs: { label: string; path: string }[] = [{ label: 'Home', path: '/' }];
  let acc = '';
  for (const seg of segments) {
    acc += '/' + seg;
    crumbs.push({ label: prettyLabel(seg), path: acc });
  }
  return crumbs;
}

function prettyLabel(seg: string): string {
  const map: Record<string, string> = {
    crm: 'CRM', employees: 'Employees', hr: 'HR', it: 'IT', kb: 'Knowledge Base',
    org: 'Org', api: 'API', faq: 'FAQ', sla: 'SLA',
  };
  if (map[seg.toLowerCase()]) return map[seg.toLowerCase()];
  return seg.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}
