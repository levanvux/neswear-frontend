import { fetchApi } from "@/lib/api";
import { CreateAddressDto, LoginDto, RegisterDto } from "@/types/auth";
import { User } from "@/types/user";

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
  return fetchApi<{ access_token: string }>("/auth/refresh", {
    method: "POST",
  });
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

export function createAddress(
  access_token: string | null,
  address: CreateAddressDto,
) {
  if (!access_token) {
    throw new Error("No access_token found");
  }

  return fetchApi<CreateAddressDto>("/auth/me/addresses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(address),
  });
}
