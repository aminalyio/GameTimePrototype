class SessionStorageService {
  constructor() {
    this.isAvailable = false;

    this.init();
  }

  init() {
    try {
      this.sessionStorage = window.sessionStorage;
    } catch(e) {
      // ignore
    }

    this.testSessionStorageAvailability();
  }

  testSessionStorageAvailability() {
    try {
      this.sessionStorage.setItem("test", "test");
      this.sessionStorage.removeItem("test");
      this.isAvailable = true;
    } catch (error) {
      // ignore
    }
  }

  set(key, value) {
    if (!this.isAvailable || !key || !value) {
      return;
    }

    this.sessionStorage.setItem(key, JSON.stringify(value));
  }

  get(key) {
    if (!this.isAvailable) {
      return undefined;
    }

    const value = this.sessionStorage.getItem(key);
    return value ? JSON.parse(value) : value;
  }

  delete(key) {
    if (!this.isAvailable) {
      return;
    }

    this.sessionStorage.removeItem(key);
  }
}

export default new SessionStorageService();
