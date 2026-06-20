import { useState } from 'react';
import { ChevronDown, Search, Bell, Plus, HelpCircle, Settings2, ChevronRight } from 'lucide-react';
import { navSections } from '../../config/nav';
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
      className={['flex flex-col bg-ink-900 text-ink-100 border-r border-ink-800 transition-all duration-200 flex-shrink-0', collapsed ? 'w-16' : 'w-60'].join(' ')}
    >
      {/* Brand */}
      <div className="h-14 flex items-center px-3 border-b border-ink-800">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-white font-bold text-sm">G</span>
        </div>
        {!collapsed && (
          <div className="ml-2.5 min-w-0">
            <p className="text-sm font-semibold text-white leading-tight">GuideOS</p>
            <p className="text-[10px] text-ink-400 uppercase tracking-wider">NerithonX</p>
          </div>
        )}
        {!collapsed && (
          <button onClick={onToggleCollapse} className="ml-auto text-ink-400 hover:text-white p-1 rounded-md hover:bg-ink-800" aria-label="Collapse sidebar">
            <ChevronRight className="h-4 w-4 rotate-180" />
          </button>
        )}
      </div>

      {/* Scrollable nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-2">
        {collapsed && (
          <button onClick={onToggleCollapse} className="w-full flex justify-center text-ink-400 hover:text-white p-2 mb-1" aria-label="Expand sidebar">
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
        {navSections.map(section => (
          <div key={section.id} className="px-2 mb-1">
            {!collapsed && (
              <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-ink-500">{section.label}</p>
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
                      'w-full flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] transition-colors group',
                      collapsed ? 'justify-center' : '',
                      on ? 'bg-brand-600/20 text-white' : 'text-ink-300 hover:bg-ink-800 hover:text-white',
                    ].join(' ')}
                  >
                    {item.icon}
                    {!collapsed && <span className="truncate text-left flex-1">{item.label}</span>}
                    {!collapsed && item.badge && (
                      <span className="ml-auto inline-flex items-center justify-center min-w-[18px] h-4 px-1 text-[10px] font-medium rounded-full bg-accent-500 text-white">
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

      {/* Bottom user */}
      <div className="border-t border-ink-800 p-2">
        <button className={['w-full flex items-center gap-2 p-1.5 rounded-md hover:bg-ink-800 transition-colors', collapsed ? 'justify-center' : ''].join(' ')}>
          <Avatar name="Fatima Ibrahim" size={28} />
          {!collapsed && (
            <div className="text-left min-w-0 flex-1">
              <p className="text-xs font-medium text-white truncate">Fatima Ibrahim</p>
              <p className="text-[10px] text-ink-400 truncate">Super Admin</p>
            </div>
          )}
          {!collapsed && <ChevronDown className="h-3.5 w-3.5 text-ink-400" />}
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

  return (
    <header className="h-14 flex-shrink-0 bg-white border-b border-ink-200 flex items-center gap-3 px-4 lg:px-6">
      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input
            placeholder="Search employees, deals, tickets, articles..."
            className="h-9 w-full rounded-lg border border-ink-200 bg-ink-50 pl-9 pr-16 text-sm placeholder:text-ink-400 focus:bg-white focus-ring"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-ink-400 bg-white border border-ink-200 rounded px-1.5 py-0.5">⌘K</kbd>
        </div>
      </div>

      {/* Breadcrumbs in header right */}
      <div className="hidden xl:flex items-center text-xs text-ink-500 gap-1.5 ml-4 flex-1">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3 text-ink-300" />}
            <button onClick={() => onNavigate(c.path)} className="hover:text-ink-900 transition-colors">{c.label}</button>
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5 ml-auto">
        <button onClick={() => onNavigate('/onboarding')} className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors">
          <Plus className="h-3.5 w-3.5" /> New Hire
        </button>
        <button onClick={() => onNavigate('/notifications')} className="relative h-9 w-9 rounded-lg flex items-center justify-center text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition-colors" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent-500 ring-2 ring-white" />
        </button>
        <button className="h-9 w-9 rounded-lg flex items-center justify-center text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition-colors" aria-label="Help">
          <HelpCircle className="h-4 w-4" />
        </button>
        <button onClick={() => onNavigate('/settings')} className="h-9 w-9 rounded-lg flex items-center justify-center text-ink-500 hover:bg-ink-100 hover:text-ink-900 transition-colors" aria-label="Settings">
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
