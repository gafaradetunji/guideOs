import { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar, Header } from '@/components/shell/Sidebar';

/**
 * The console shell: sidebar + header wrapped around whatever route matched.
 */
export default function DashboardLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Close the mobile drawer whenever navigation happens.
  useEffect(() => { setMobileNavOpen(false); }, [pathname]);

  // Lock body scroll behind the open drawer.
  useEffect(() => {
    if (!mobileNavOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [mobileNavOpen]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileNavOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileNavOpen]);

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-ink-50 console-grid">
      {/* Off-canvas backdrop (mobile / tablet only) */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink-900/50 animate-fade-in lg:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar
        path={pathname}
        onNavigate={navigate}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header path={pathname} onNavigate={navigate} onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
