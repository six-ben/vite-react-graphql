const _setInteval = window.setInterval;
const _setTimeout = window.setTimeout;

//@ts-ignore
window.setInterval = function (callback: any, ms = 0, ...args: any[]) {
  return _setInteval(callback, Math.min(ms, 2 ** 31 - 1), ...args);
};

//@ts-ignore
window.setTimeout = function (callback: () => void, ms = 0, ...args: any[]): number {
  return _setTimeout(callback, Math.min(ms, 2 ** 31 - 1), ...args);
};
