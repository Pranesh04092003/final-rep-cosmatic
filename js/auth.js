// Authentication functions
class AuthManager {
  constructor() {
    this.currentUser = this.loadUser();
  }

  loadUser() {
    const stored = localStorage.getItem('cosmetic_user');
    return stored ? JSON.parse(stored) : null;
  }

  saveUser(user) {
    localStorage.setItem('cosmetic_user', JSON.stringify(user));
    this.currentUser = user;
  }

  async register(email, password, name) {
    try {
      const user = await window.api.signupApi({ email, password, name });
      this.saveUser(user);
      return { success: true, message: 'Registration successful' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async login(email, password) {
    try {
      const user = await window.api.loginApi({ email, password });
      this.saveUser(user);
      return { success: true, message: 'Login successful' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  async adminLogin(password) {
    try {
      const user = await window.api.adminLoginApi({ password });
      this.saveUser(user);
      return { success: true, message: 'Admin login successful' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  logout() {
    localStorage.removeItem('cosmetic_user');
    this.currentUser = null;
  }

  isLoggedIn() {
    return this.currentUser !== null;
  }

  isAdmin() {
    return this.currentUser && this.currentUser.isAdmin === true;
  }
}

const authManager = new AuthManager();
