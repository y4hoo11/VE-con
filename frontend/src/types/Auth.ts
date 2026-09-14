export interface User {
  username: string;
  role: string;
}

export type AuthResult =
  | { success: true; user: User }
  | { success: false; message: string };

export interface Account {
  username: string;
  password: string;
  role?: string;
}