# Task Completion Checklist

Before handing off frontend changes:

1. Run `npm run build`.
2. Run focused tests if present (`npm run test` or specific test command).
3. If GraphQL schema/documents changed, run `npm run codegen` and then build.
4. If UI changed significantly, run the local dev server and inspect the page in browser when feasible.
5. Report any commands that could not be run, especially dependency install/network issues.