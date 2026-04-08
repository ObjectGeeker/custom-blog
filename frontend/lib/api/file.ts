import { ApiError, getAuthToken, tryRefreshToken } from "./client";
import type { BaseResponse, UploadFileResponse } from "@/lib/types";

export async function uploadFile(file: File): Promise<UploadFileResponse> {
  return doUpload(file, false);
}

async function doUpload(
  file: File,
  isRetry: boolean,
): Promise<UploadFileResponse> {
  const token = getAuthToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/file/upload", {
    method: "POST",
    headers,
    body: formData,
  });

  if (res.status === 401 && !isRetry) {
    if (await tryRefreshToken()) return doUpload(file, true);
    throw new ApiError("40100", "登录已过期，请重新登录");
  }

  if (!res.ok) {
    throw new ApiError(String(res.status), `HTTP ${res.status}`);
  }

  const json: BaseResponse<UploadFileResponse> = await res.json();

  if (json.code === "40100" && !isRetry) {
    if (await tryRefreshToken()) return doUpload(file, true);
    throw new ApiError(json.code, json.message);
  }

  if (json.code !== "200") {
    throw new ApiError(json.code, json.message);
  }

  return json.data;
}
