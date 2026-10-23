# Contributing to AMYCC

Thank you for contributing to the Spirit of Arts & Culture Association (AMYCC) open-source repository.

## Contribution Guidelines
1. **Branching**: Create feature branches from `main` using descriptive names (e.g., `feat/event-calendar` or `fix/arabic-spacing`).
2. **Coding Standards**:
   - Write strict TypeScript.
   - Use Tailwind CSS v4 design tokens defined in `src/app/globals.css`.
   - Never commit sensitive secrets or `.env.local` files.
3. **Multilingual Integrity**:
   - When adding interface text, always update all three dictionary files: `src/messages/ar.json`, `src/messages/fr.json`, and `src/messages/en.json`.
   - Ensure RTL styling looks balanced when viewing in Arabic.
4. **Verification**:
   - Always run `npm run build` locally before pushing to ensure zero TypeScript errors.
