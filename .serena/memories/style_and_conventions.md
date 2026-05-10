# Style And Conventions

- Build a thin, typed, contract-driven frontend.
- Backend contracts in `external/` are the source of truth.
- Prefer generated GraphQL types when domain GraphQL schema exists; currently domain endpoints are REST.
- Keep server data in Apollo cache for GraphQL and query state/local component state for REST; don't duplicate server data in Zustand without a strong reason.
- Forms should use React Hook Form plus Zod for non-trivial validation.
- Optional strings should be trimmed before save; empty optional strings should be sent as `null` if backend expects nullable values, otherwise omitted conservatively.
- UI should be a usable operational app on first screen, not a marketing page.
- Use clean dense layouts, cards only for repeated entities/dialogs/tool surfaces, no card nesting.
- Mobile is one column; desktop can use denser grids.
- Use Hungarian user-facing copy for this project.
- ASCII for code edits unless the existing/user-facing content requires Hungarian accents.