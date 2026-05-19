#!/bin/sh
set -eu

: "${VITE_API_BASE_URL:=http://localhost:3000}"
: "${VITE_GOOGLE_LOGIN_PATH:=/auth/login/google}"

escape_js_string() {
  printf '%s' "$1" | tr -d '\r\n' | sed 's/\\/\\\\/g; s/"/\\"/g'
}

cat > /usr/share/nginx/html/env.js <<EOF
window.__APP_CONFIG__ = {
  VITE_API_BASE_URL: "$(escape_js_string "$VITE_API_BASE_URL")",
  VITE_GOOGLE_LOGIN_PATH: "$(escape_js_string "$VITE_GOOGLE_LOGIN_PATH")"
};
EOF
