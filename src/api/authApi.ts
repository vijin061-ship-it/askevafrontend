import { axiosClient } from "./axiosClient";
import type { LoginCredentials, LoginResponse } from "@/types/auth";

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await axiosClient.post("/auth/login", credentials);
    const data = response.data; 

    let expiresAt = Date.now() + 24 * 60 * 60 * 1000; // default 1 day
    try {
      const payloadBase64 = data.token.split(".")[1];
      const payloadDecoded = JSON.parse(atob(payloadBase64));
      if (payloadDecoded.exp) {
        expiresAt = payloadDecoded.exp * 1000;
      }
    } catch (e) {
      console.error("Failed to parse token expiration:", e);
    }

    return {
      user: {
        id: String(data.user.id),
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        avatarUrl: data.user.avatarUrl || "",
      },
      tokens: {
        accessToken: data.token,
        expiresAt,
      },
    };
  },

  logout: async (): Promise<void> => {
    return Promise.resolve();
  },
};
