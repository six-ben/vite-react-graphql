import React, { ComponentType, useMemo } from 'react';
import { matchPath, useLocation } from 'react-router';

import { syncState } from 'src/store/syncstate';

export interface RouteOption {
  title?: string;
  icon?: JSX.Element;
  path?: string | string[];
  query?: Record<string, string>;
  redirect?: string;
  getComponent?: () => Promise<{ default: ComponentType<any> }>;
  children?: RouteOption[];
  hiddenInSideBar?: boolean;
}

export function useRoutes() {
  const { pathname, search } = useLocation();

  const routes = useMemo(() => {
    const result: RouteOption[] = [
      {
        title: '首页',
        path: '/',
        getComponent: () => import('src/pages/OverView'),
      },
      {
        title: 'home',
        path: '/home',
        getComponent: () => import('src/pages/Home'),
      },
    ];
    return result;
  }, []);

  const currentRoute = useMemo(
    () =>
      routes
        .map((e) => e.children || e)
        .flat()
        .find(({ path, query }) => {
          const matchSearch = () => {
            if (!query) return true;
            const searchParams = new URLSearchParams(search);
            for (const key in query) {
              if (searchParams.get(key) !== query[key]) {
                return false;
              }
            }
            return true;
          };
          const matchedPath = matchPath(pathname, { path, exact: true });
          if (matchedPath && matchSearch()) {
            syncState.setPathParams(matchedPath.params);
            return true;
          }
          return false;
        }),
    [pathname, search, routes],
  );

  return { routes, currentRoute };
}
