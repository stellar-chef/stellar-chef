export default class LocalStorage {
  get(key: string): string | null {
    const value = localStorage.getItem(key);
    if (value === null) {
      return null;
    }
    return value;
  }

  set(key: string, value: object[]): void {
    const stringValue = JSON.stringify(value);
    localStorage.setItem(key, stringValue);
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }
}
