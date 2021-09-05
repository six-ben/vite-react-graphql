import React, { createElement, useState, useEffect, ReactNode, useRef, useMemo } from 'react';
import { BrowserRouter, Route, useHistory } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ConfigProvider, Layout, message } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { ApolloProvider } from '@apollo/client';
import LoadingBar from 'react-top-loading-bar';
import { render } from 'react-dom';

import { syncState } from 'src/store/syncstate';
import { apolloClient } from 'src/service/apollo';
import { useRoutes } from 'src/routes';
import GlobalStyle from 'src/components/GlobalStyle';
import AppBar from 'src/components/AppBar';
import SideBar from 'src/components/SideBar';
import { logger } from 'src/common/logger';

type LoadingBarRef = {
  add(value: number): void;
  decrease(value: number): void;
  continuousStart(startingValue?: number, refreshRate?: number): void;
  staticStart(startingValue: number): void;
  complete(): void;
};

const componentMap = new Map<() => Promise<{ default: React.ComponentType<any> }>, React.ComponentType<any>>();

let latestLoader: Promise<{ default: React.ComponentType<any> }>;

function Content() {
  const { currentRoute } = useRoutes();
  const history = useHistory();
  const [content, setContent] = useState<ReactNode>('');
  const ref = useRef<LoadingBarRef>(null);

  useMemo(() => {
    if (currentRoute) syncState.setRoutingFetching(true);
  }, [currentRoute]);

  const mountContent = (content: ReactNode) => {
    syncState.setRoutingFetching(false);
    setContent(content);
  };

  useEffect(() => {
    if (!currentRoute) return mountContent('Not found');
    window.scrollTo(0, 0);
    const { getComponent, redirect } = currentRoute;
    if (redirect) {
      history.replace(redirect);
    }
    if (getComponent) {
      const T = componentMap.get(getComponent);
      if (T) {
        mountContent(createElement(T));
      } else {
        ref.current?.continuousStart();
        const loader = getComponent();
        latestLoader = loader;
        loader
          .then(({ default: Type }) => {
            componentMap.set(getComponent, Type);
            if (loader === latestLoader) {
              mountContent(createElement(Type));
              ref.current?.complete();
            }
          })
          .catch((err) => {
            if (syncState.isUnloaded) return;
            logger.error(err);
            message.error('页面加载失败，请稍后重试');
            ref.current?.complete();
          });
      }
    }
  }, [currentRoute, history]);

  return (
    <Layout.Content
      style={{
        margin: '24px',
        minHeight: 280,
      }}
    >
      <LoadingBar ref={ref} color="#40a9ff"></LoadingBar>
      {content}
    </Layout.Content>
  );
}

function App() {
  return (
    <>
      <GlobalStyle></GlobalStyle>
      <ConfigProvider locale={zhCN}>
        <ApolloProvider client={apolloClient}>
          <BrowserRouter>
            <QueryParamProvider ReactRouterRoute={Route}>
              <Layout>
                <SideBar></SideBar>
                <Layout>
                  <AppBar></AppBar>
                  <Content></Content>
                </Layout>
              </Layout>
            </QueryParamProvider>
          </BrowserRouter>
        </ApolloProvider>
      </ConfigProvider>
    </>
  );
}

export function renderApp(container: Element | null) {
  render(<App />, container);
}
