import type { ComponentType } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { RouteProps } from '@/lib/types';

/**
 * Bridges the page components onto React Router.
 *
 * Pages still take the `{ path, navigate }` pair they were written against, so
 * this adapter feeds them from router hooks instead of a hand-rolled router.
 * A page can drop the props and call `useNavigate` / `useParams` directly at any
 * point — this wrapper keeps working either way, so the migration is per-page
 * rather than one sweeping change.
 */
export function withRouteProps(Page: ComponentType<RouteProps>) {
  return function RoutePropsAdapter() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    return <Page path={pathname} navigate={navigate} />;
  };
}
