import { post } from "./client";
import type { LoginRequest, LoginResponse } from "@/lib/types";

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return post<LoginResponse>("/api/security/login", data);
}
