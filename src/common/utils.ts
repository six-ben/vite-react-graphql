export function convertToMap<T extends Record<string, any>, V = T>(list: (T | null)[], key: keyof T): Record<string, V>;
export function convertToMap<T extends Record<string, any>, V = string>(
  list: (T | null)[],
  key: keyof T,
  value: keyof T,
  fallback?: any,
): Record<string, V>;
export function convertToMap<T extends Record<string, any>, V = string>(
  list: (T | null)[],
  key: any,
  value?: any,
  fallback?: any,
) {
  const argLength = arguments.length;
  const result: Record<string, V> = {};
  list.forEach((item) => {
    if (item) {
      result[item[key]] = value ? item[value] : item;
    }
  });
  return new Proxy(result, {
    get: (target, prop: string) => {
      return prop in target ? target[prop] : argLength === 4 ? fallback : prop;
    },
  });
}

export function foreverSuccess(callback: () => Promise<any>, interval = 1000) {
  callback().catch(() => {
    setTimeout(() => foreverSuccess(callback, interval), interval);
  });
}

/**
 * TODO: 指定前景色来获取颜色
 *
 * 暂时假设前景色为白色
 */
export function getColorFromChar(char: string) {
  const colors = ['blue', 'cyan', 'orange', 'gold', 'geekblue', 'lime', 'green', 'purple', 'magenta', 'red', 'volcano'];
  return colors[char.charCodeAt(0) % colors.length];
}

export function convertToList<T extends Record<string, any>>(list: T) {
  const result = [];
  for (const i in list) {
    result.push({
      label: list[i],
      value: i,
    });
  }

  return result;
}

export function proxyMap(object: Record<string, any>) {
  return new Proxy(object, {
    get: (target, prop: string) => {
      return prop in target ? target[prop] : prop;
    },
  });
}

export function getUnique<T>(arr: T[], uniId: keyof T) {
  const res = new Map();
  return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
}
