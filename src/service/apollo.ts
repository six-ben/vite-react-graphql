/**
 * 使用 Apollo 进行 graphql 请求
 */
import { ApolloClient, InMemoryCache, HttpLink, from, ApolloLink, Operation, NextLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { RetryLink } from '@apollo/client/link/retry';
import { message as Message } from 'antd';

import { syncState } from 'src/store/syncstate';
import { graphqlErrorMap, errorCodeMap, grapCommonErrorMap } from 'src/common/error';
import { API_BASE } from 'src/common/constants';

// https://www.apollographql.com/docs/react/api/link/apollo-link-error
// https://www.apollographql.com/docs/react/data/error-handling
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  // 跟 https://www.apollographql.com/docs/react/data/error-handling/#graphql-error-policies 有区别
  if (operation.getContext().ignoreError) return;
  if (syncState.isUnloaded) return;
  const errorSet = new Set<string>();
  if (graphQLErrors) {
    graphQLErrors.forEach((err) => {
      if (err.extensions) {
        const { code } = err.extensions;
        // 已知 graphQL 错误
        if (code in graphqlErrorMap) {
          errorSet.add(graphqlErrorMap[code as keyof typeof graphqlErrorMap]);
        }
        // grpc 通用错误 0-16
        else if (code in grapCommonErrorMap) {
          errorSet.add(grapCommonErrorMap[code as keyof typeof grapCommonErrorMap]);
        }
        // 显示通用错误
        else if (code >= 500000) {
          errorSet.add(graphqlErrorMap[500000]);
        } else if (code >= 400000) {
          errorSet.add(graphqlErrorMap[400000]);
        } else {
          errorSet.add(err.extensions.message || err.message);
        }
      } else {
        errorSet.add(err.message);
      }
    });
  } else if (networkError) {
    if ('statusCode' in networkError) {
      const { statusCode } = networkError;
      if (statusCode === 401) {
        errorSet.add(errorCodeMap[401]);
      }
      if (statusCode >= 500) {
        errorSet.add(errorCodeMap[500]);
      }
    } else {
      errorSet.add(errorCodeMap[0]);
    }
  }
  errorSet.forEach((content) => Message.error({ content, key: content, duration: 2 + Math.random() }));
});

// https://github.com/apollographql/apollo-feature-requests/issues/6
// 自动忽略请求中的 __typename,
// 可能导致文件上传失败
const omitTypename = (key: string, value: any) => (key === '__typename' ? undefined : value);
export const omitTypenameLink = new ApolloLink((operation: Operation, forward?: NextLink) => {
  if (operation.variables) {
    operation.variables = JSON.parse(JSON.stringify(operation.variables), omitTypename);
  }
  return forward ? forward(operation) : null;
});

export const apolloClient = new ApolloClient({
  // Link 是有顺序的：https://www.apollographql.com/docs/react/api/link/introduction
  link: from([
    omitTypenameLink,
    errorLink,
    // https://www.apollographql.com/docs/react/api/link/apollo-link-retry/
    new RetryLink({
      attempts: {
        retryIf: (error) => {
          return (
            // 网络问题重试
            [0, 504].includes(error?.statusCode) ||
            // 服务器可恢复错误
            [2, 4, 5, 8, 10, 11, 13, 14, 500000].includes(error?.result?.errors?.[0]?.extensions?.code)
          );
        },
      },
    }),
    new HttpLink({
      // concern development
      uri: (operation) => `${API_BASE || '/api/v2/'}query?operationName=${operation.operationName}`,
    }),
  ]),
  cache: new InMemoryCache(),
  // https://www.apollographql.com/docs/react/data/queries/#setting-a-fetch-policy
  // https://www.apollographql.com/docs/react/data/error-handling/#graphql-error-policies
  defaultOptions: {
    // 默认只使用缓存
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      // fetchPolicy 为 `cache-and-network` 时，缓存时会重新发送请求，nextFetchPolicy 指定查询完成后要使用的FetchPolicy
      // issues https://github.com/apollographql/apollo-client/issues/6833
      nextFetchPolicy(lastFetchPolicy) {
        if (lastFetchPolicy === 'cache-and-network' || lastFetchPolicy === 'network-only') {
          return 'cache-first';
        }
        return lastFetchPolicy;
      },
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});
