export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager";
  avatarUrl: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  expiresAt: number; // epoch ms
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}
