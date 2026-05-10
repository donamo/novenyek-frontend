# Suggested Commands

After scaffolding the frontend, expected commands:

```bash
npm install
npm run dev
npm run build
npm run test
npm run lint
npm run codegen
```

Useful Darwin/project commands:

```bash
rg --files
rg "pattern" src external
sed -n '1,200p' file
npm run dev -- --host 0.0.0.0
```

Backend API base should be configured with `VITE_API_BASE_URL`, defaulting to `http://localhost:3000` if unset.