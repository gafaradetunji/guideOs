import { createBrowserRouter, type RouteObject } from 'react-router-dom';

import { getCurrentProduct } from '@/routes/products';
import { guideosRoutes } from '@/routes/guideos.routes';

/**
 * Picks the route tree for the product serving this hostname.
 *
 * Each product owns one `*.routes.tsx` file and contributes it here. Because the
 * products are separated by subdomain rather than by URL prefix, every tree is
 * free to own `/` — they never collide at runtime, since only one product is
 * ever resolved per request.
 */
function getRoutes(): RouteObject[] {
  const product = getCurrentProduct();

  switch (product) {
    case 'guideos':
    default:
      return guideosRoutes;
  }
}

export const router = createBrowserRouter(getRoutes());
