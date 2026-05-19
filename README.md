# novenyek-frontend

## Konfiguráció

Az API címe a `VITE_API_BASE_URL` környezeti változóval állítható.

Lokális Vite fejlesztésnél a Vite a megszokott `.env` / shell változókat olvassa:

```bash
VITE_API_BASE_URL=http://localhost:3000 npm run dev
```

Dockeres futtatásnál az érték runtime konfigurációként kerül az appba. A konténer induláskor az nginx entrypoint legenerálja az `/env.js` fájlt, ezért ugyanaz az image más környezetben más API címmel is futtatható:

```bash
VITE_API_BASE_URL=https://api.example.com docker compose up -d --build
```

Ha az image már megvan, és csak az API URL változik, elég a konténert újra létrehozni az új env értékkel.

Alapértelmezett Docker Compose érték:

```text
https://novenyek-api.donamo.science
```

## Docker release

A GitHub Actions csak `vX.Y.Z` formátumú tag push esetén készít Docker image-et, például:

```bash
git tag v1.0.0
git push origin v1.0.0
```

A workflow a Dockerfile `runner` stage-ét buildeli és a GitHub Container Registry-be pusholja:

```text
ghcr.io/<owner>/<repo>:v1.0.0
```
