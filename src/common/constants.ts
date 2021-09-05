import { convertToMap } from 'src/common/utils';

export const MODE = import.meta.env.MODE;
export const PROD = import.meta.env.PROD;
export const DEV = import.meta.env.DEV;
export const RELEASE = process.env.RELEASE;
export const COMMAND = process.env.COMMAND;
export const API_BASE = process.env.API_BASE;

// 不要删除过时饿 key，避免客户端缓存冲突
export const localStorageKey = {
  APP_STATE: 'appState',
  INDICATOR: 'indicator',
};

export const sessionStorageKey = {
  STATISTICS_FILTER_PARAMS: 'statistics_filter_params_v2',
};

export const regExp = {
  DOAMIN: new RegExp(/^(?=^.{3,255}$)[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+$/, 'g'),
};


