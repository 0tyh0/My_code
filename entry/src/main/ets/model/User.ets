export class User {
  userId: number = 0;
  username: string = '';
  upwd: string = '';
  utel: string = '';
  uemail: string = '';
  isenable: number = 1;
}

export class AuthResult {
  success: boolean = false;
  message: string = '';
  user: User | null = null;
  newUserId: number = 0;

  constructor(success: boolean, message: string, user: User | null, newUserId: number) {
    this.success = success;
    this.message = message;
    this.user = user;
    this.newUserId = newUserId;
  }
}
