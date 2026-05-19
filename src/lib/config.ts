type RuntimeConfig = {
  VITE_API_BASE_URL?: string;
  VITE_GOOGLE_LOGIN_PATH?: string;
};

declare global {
  interface Window {
    __APP_CONFIG__?: RuntimeConfig;
  }
}

function getRuntimeConfigValue(key: keyof RuntimeConfig) {
  if (typeof window === "undefined") return undefined;
  return getStringValue(window.__APP_CONFIG__?.[key]);
}

function getStringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function getConfigValue(key: keyof RuntimeConfig, fallback: string) {
  return getRuntimeConfigValue(key) ?? getStringValue(import.meta.env[key]) ?? fallback;
}

function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, "");
}

function normalizePath(path: string) {
  return path.startsWith("/") ? path : `/${path}`;
}

export const API_BASE_URL = normalizeBaseUrl(getConfigValue("VITE_API_BASE_URL", "http://localhost:3000"));
export const GOOGLE_LOGIN_PATH = normalizePath(getConfigValue("VITE_GOOGLE_LOGIN_PATH", "/auth/login/google"));
