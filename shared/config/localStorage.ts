export interface IStorageItem {
  key: string;
  value: string;
}

export class StorageItem {
  key: string;

  value: string;

  constructor(data: IStorageItem) {
    this.key = data.key;
    this.value = data.value;
  }
}

export const LocalStorage = {
  add(key: string, item: string) {
    localStorage.setItem(key, item);
  },
  get(key: string) {
    return localStorage.getItem(key);
  },
  remove(key: string) {
    localStorage.removeItem(key);
  },
  clear() {
    localStorage.clear();
  },
};
