/**
 * Product resolution for the multi-tenant shell.
 *
 * Every product lives in this one codebase and is selected by subdomain rather
 * than by a path prefix, so `guideos.example.app` and `payroll.example.app`
 * serve different route trees from the same bundle.
 *
 * Today only "guideos" ships; the remaining entries exist so a new product is
 * a route file plus a hostname, not a restructure.
 */
export type Product = 'guideos';

export const DEFAULT_PRODUCT: Product = 'guideos';

/** Hostnames that map onto a product, including their `.localhost` twins. */
const PRODUCT_HOSTS: Record<string, Product> = {
  'guideos.nerithonx.app': 'guideos',
  'guideos.localhost': 'guideos',
};

/**
 * Resolve the active product.
 *
 * `VITE_PRODUCT` wins when set, which is how a single `npm run dev` can preview
 * any tenant without touching `/etc/hosts`. Otherwise the hostname decides, and
 * anything unrecognised (localhost, preview URLs, custom domains) falls back to
 * the default product.
 */
export function getCurrentProduct(): Product {
  const override = import.meta.env.VITE_PRODUCT;
  if (isProduct(override)) return override;

  if (typeof window === 'undefined') return DEFAULT_PRODUCT;

  return PRODUCT_HOSTS[window.location.hostname] ?? DEFAULT_PRODUCT;
}

function isProduct(value: unknown): value is Product {
  return value === 'guideos';
}
