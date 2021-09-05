import { createStore, createEvent } from 'effector';

import { lscache } from 'src/common/caches';
import { localStorageKey } from 'src/common/constants';

let keycloakReadyResolve: () => void;
export const keycloakReady = new Promise<void>((res) => (keycloakReadyResolve = res));

interface AppState {
  sidebarCollapsed: boolean;
}

const { sidebarCollapsed = false } = (lscache.get(localStorageKey.APP_STATE) || {}) as Partial<AppState>;

export const appState = createStore<AppState>({ sidebarCollapsed });

export const toggleSidebar = createEvent<void>();

appState.on(toggleSidebar, (state) => {
  return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
});

window.addEventListener('unload', () => {
  lscache.set(localStorageKey.APP_STATE, appState.getState());
});
