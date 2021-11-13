import Store from "electron-store";

export const store = new Store();

export function tryGetValue<T>(key: string, defaultValue: T):T {
    const value = store.get(key) as T;
    if(value)return value;
    store.set(key,defaultValue);
    return defaultValue;
  }
  