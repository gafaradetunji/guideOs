import { useState, useEffect, useCallback } from 'react';

export function useRouter() {
  const [path, setPath] = useState(() => getPath());

  const navigate = useCallback((to: string) => {
    if (to === path) return;
    window.history.pushState({}, '', to);
    setPath(to);
    window.scrollTo({ top: 0 });
  }, [path]);

  useEffect(() => {
    const onPop = () => setPath(getPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return { path, navigate };
}

function getPath(): string {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash.startsWith('/')) return hash;
  if (window.location.pathname.startsWith('/')) return window.location.pathname;
  return '/';
}
