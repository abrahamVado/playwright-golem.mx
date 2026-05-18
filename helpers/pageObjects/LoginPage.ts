class LoginPage {
  constructor(public page: any) {}

  async navigateToLoginPage() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.page.fill('#email', email);
    await this.page.fill('#password', password);
    await this.page.click('button[type="submit"]');
  }
}

export default LoginPage;