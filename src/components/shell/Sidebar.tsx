import { useState } from 'react';
import { ChevronDown, Search, Bell, Plus, HelpCircle, Settings2, ChevronRight, Activity, ShieldCheck, Command, Menu, X } from 'lucide-react';
import { navSections, routeCount } from '../../config/nav';
import { Avatar } from '../ui';

interface SidebarProps {
  path: string;
  onNavigate: (to: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ path, onNavigate, collapsed, onToggleCollapse, mobileOpen, onCloseMobile }: SidebarProps) {
  const activeRoot = path;
  // Below lg the sidebar is an off-canvas drawer, so the collapsed rail only applies from lg up.
  return (
    <aside
      className={[
        'flex flex-col text-ink-100 border-r flex-shrink-0',
        'bg-[linear-gradient(180deg,#081120_0%,#0b172a_55%,#0d1a2f_100%)] border-white/10 shadow-[inset_-1px_0_0_rgba(255,255,255,0.05)]',
        // Mobile / tablet: fixed off-canvas panel
        'fixed inset-y-0 left-0 z-50 w-[min(18rem,85vw)] transition-transform duration-200 ease-out',
        mobileOpen ? 'translate-x-0 shadow-pop' : '-translate-x-full',
        // lg and up: back in normal flow
        'lg:static lg:translate-x-0 lg:shadow-none lg:transition-[width] lg:duration-200',
        collapsed ? 'lg:w-16' : 'lg:w-72',
      ].join(' ')}
      aria-hidden={undefined}
    >
      <div className="h-16 flex items-center px-3 border-b border-white/10">
        <div className="h-9 w-9 rounded-md bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center flex-shrink-0 shadow-sm ring-1 ring-white/10">
          <Command className="h-4 w-4 text-white" />
        </div>
        <div className={['ml-3 min-w-0', collapsed ? 'lg:hidden' : ''].join(' ')}>
          <p className="text-[13px] font-semibold text-white leading-tight">GuideOS Control Plane</p>
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.14em]">NerithonX / Production</p>
        </div>
        {!collapsed && (
          <button onClick={onToggleCollapse} className="ml-auto hidden lg:block text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/5" aria-label="Collapse sidebar">
            <ChevronRight className="h-4 w-4 rotate-180" />
          </button>
        )}

        <button onClick={onCloseMobile} className="ml-auto lg:hidden text-slate-400 hover:text-white p-1.5 rounded-md hover:bg-white/5" aria-label="Close navigation">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className={collapsed ? 'lg:hidden' : ''}>
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
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin py-2">
        {collapsed && (
          <button onClick={onToggleCollapse} className="w-full hidden lg:flex justify-center text-slate-400 hover:text-white p-2 mb-1" aria-label="Expand sidebar">
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
        {navSections.map(section => (
          <div key={section.id} className="px-2 mb-2">
            {(
              <div className={['px-2 py-1.5 flex items-center justify-between', collapsed ? 'lg:hidden' : ''].join(' ')}>
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
                      collapsed ? 'lg:justify-center' : '',
                      on ? 'bg-brand-500/15 text-white ring-1 ring-brand-400/20' : 'text-slate-300 hover:bg-white/[0.04] hover:text-white',
                    ].join(' ')}
                  >
                    <span className={on ? 'text-brand-300' : 'text-slate-500 group-hover:text-slate-200'}>{item.icon}</span>
                    <span className={['truncate text-left flex-1', collapsed ? 'lg:hidden' : ''].join(' ')}>{item.label}</span>
                    {item.badge && (
                      <span className={['ml-auto inline-flex items-center justify-center min-w-[18px] h-4 px-1 text-[10px] font-mono rounded-md bg-emerald-400/15 text-emerald-300', collapsed ? 'lg:hidden' : ''].join(' ')}>
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
        {(
          <div className={['mb-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2', collapsed ? 'lg:hidden' : ''].join(' ')}>
            <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.08em] text-slate-400">
              <span>Access</span>
              <span className="inline-flex items-center gap-1 text-emerald-300"><ShieldCheck className="h-3 w-3" /> RBAC Active</span>
            </div>
          </div>
        )}
        <button className={['w-full flex items-center gap-2 p-2 rounded-md hover:bg-white/[0.04] transition-colors', collapsed ? 'lg:justify-center' : ''].join(' ')}>
          <Avatar name="Fatima Ibrahim" size={28} />
          <div className={['text-left min-w-0 flex-1', collapsed ? 'lg:hidden' : ''].join(' ')}>
            <p className="text-xs font-medium text-white truncate">Fatima Ibrahim</p>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.08em] truncate">Super Admin</p>
          </div>
          <ChevronDown className={['h-3.5 w-3.5 text-slate-400', collapsed ? 'lg:hidden' : ''].join(' ')} />
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
  onOpenMobileNav: () => void;
}

export function Header({ path, onNavigate, onOpenMobileNav }: HeaderProps) {
  const crumbs = buildBreadcrumbs(path);
  const currentLabel = crumbs[crumbs.length - 1]?.label ?? 'Dashboard';
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="flex-shrink-0 panel-sheen bg-white/80 border-b border-ink-200/80">
      <div className="h-14 sm:h-16 flex items-center gap-2 sm:gap-4 px-3 sm:px-4 lg:px-6">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden h-9 w-9 -ml-1 rounded-md flex items-center justify-center text-ink-600 hover:bg-ink-100 hover:text-ink-900 transition-colors flex-shrink-0"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden lg:block min-w-[180px] xl:min-w-[200px]">
          <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-ink-500">Active Surface</p>
          <p className="text-sm font-semibold text-ink-900 mt-1 truncate">{currentLabel}</p>
        </div>

        {/* Current surface label stands in for the search bar on small screens */}
        <p className="lg:hidden text-sm font-semibold text-ink-900 truncate min-w-0 flex-1">{currentLabel}</p>

        <div className="hidden lg:block flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              placeholder="Search objects, queues, tickets, records..."
              className="h-10 w-full rounded-md border border-ink-300 bg-white/90 pl-9 pr-16 text-sm placeholder:text-ink-400 shadow-sm focus:bg-white focus-ring"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-ink-400 bg-white border border-ink-200 rounded px-1.5 py-0.5">CMD+K</kbd>
          </div>
        </div>

        <div className="hidden 2xl:flex items-center text-xs text-ink-500 gap-1.5 ml-2 flex-1 min-w-0">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5 min-w-0">
              {i > 0 && <ChevronRight className="h-3 w-3 text-ink-300 flex-shrink-0" />}
              <button onClick={() => onNavigate(c.path)} className="hover:text-ink-900 transition-colors truncate">{c.label}</button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 ml-auto flex-shrink-0">
          <span className="hidden xl:inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-2 text-[10px] font-mono uppercase tracking-[0.08em] text-emerald-700">
            <Activity className="h-3 w-3" /> Sync Healthy
          </span>
          <button
            onClick={() => setSearchOpen(v => !v)}
            className="lg:hidden h-9 w-9 rounded-md flex items-center justify-center text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition-colors"
            aria-label="Search"
            aria-expanded={searchOpen}
          >
            <Search className="h-4 w-4" />
          </button>
          <button onClick={() => onNavigate('/onboarding')} className="hidden md:inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-ink-900 bg-ink-900 hover:bg-ink-800 text-white text-sm font-medium transition-colors whitespace-nowrap">
            <Plus className="h-3.5 w-3.5" /> Provision User
          </button>
          <button onClick={() => onNavigate('/notifications')} className="relative h-9 w-9 rounded-md flex items-center justify-center text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition-colors" aria-label="Notifications">
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent-500 ring-2 ring-white" />
          </button>
          <button className="hidden sm:flex h-9 w-9 rounded-md items-center justify-center text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition-colors" aria-label="Help">
            <HelpCircle className="h-4 w-4" />
          </button>
          <button onClick={() => onNavigate('/settings')} className="h-9 w-9 rounded-md flex items-center justify-center text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition-colors" aria-label="Settings">
            <Settings2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Expandable search row for small screens */}
      {searchOpen && (
        <div className="lg:hidden px-3 sm:px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
            <input
              autoFocus
              placeholder="Search objects, queues, records..."
              className="h-10 w-full rounded-md border border-ink-300 bg-white/90 pl-9 pr-3 text-sm placeholder:text-ink-400 shadow-sm focus:bg-white focus-ring"
            />
          </div>
        </div>
      )}
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
