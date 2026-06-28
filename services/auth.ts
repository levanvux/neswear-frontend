import { fetchApi } from "@/lib/api";
import { LoginDto, RegisterDto, User } from "@/types/auth";

export function register(registerDto: RegisterDto) {
  return fetchApi("/auth/register", {
    method: "POST",
    body: JSON.stringify(registerDto),
  });
}

export function login(loginDto: LoginDto) {
  return fetchApi<{ access_token: string }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(loginDto),
  });
}

export function refresh() {
  return fetchApi<{ access_token: string }>("/auth/refresh");
}

export async function logout() {
  await fetchApi("/auth/logout", { method: "POST" });
}

export function getMe(access_token: string) {
  return fetchApi<User>("/auth/me", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
}
