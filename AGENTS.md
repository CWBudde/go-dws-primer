# Repository Guidelines

## Project Structure & Module Organization
- `src/` holds the application logic: `core/` for WASM + state, `editor/` for Monaco integration, `turtle/` for graphics, `lessons/` for content flow, `ui/` for layout, and `utils/` for shared helpers.
- `public/` contains static assets and the Vite entry HTML, while `styles/` stores global CSS.
- Learning materials and sample programs live in `content/`; built WASM artifacts (`dwscript.wasm`, `wasm_exec.js`) belong in `wasm/`.
- Keep tests in `tests/` or colocated `*.test.ts` files for faster iteration.

## Build, Test, and Development Commands
- `yarn dev` — launches the Vite dev server on `localhost:3000` with hot reloading.
- `yarn build` — produces the optimized `dist/` bundle used for releases.
- `yarn preview` — serves the production build locally for smoke checks.
- `yarn test` / `yarn test:e2e` — run Jest unit suites and Playwright journeys respectively.
- `yarn lint` and `yarn format` — enforce ESLint rules and Prettier formatting prior to opening PRs.
## Coding Style & Naming Conventions
- Use ES modules, async/await, and two-space indentation as seen in `src/main.js`.
- Favor descriptive camelCase for variables/functions, PascalCase for exported components, and kebab-case for files.
- Run `yarn lint` after significant refactors; fix or justify all warnings before pushing.

## Testing Guidelines
- Prefer Jest for pure logic (state managers, utilities) and Playwright for Monaco + turtle flows.
- Test files should mirror their source name (`state-manager.test.js`) and mock WASM boundaries where needed.
- Focus coverage on lesson navigation, executor, and turtle APIs because regressions block learners.
- Always run the relevant test subset plus `yarn test` before requesting review.

## Commit & Pull Request Guidelines
- Follow the existing history: imperative, scope-aware summaries (e.g., `Implement Phase 3: Educational Content System`).
- Group related changes per commit; include references to GitHub issues or PLAN items when applicable.
- PRs must describe motivation, testing evidence, steps to reproduce/verify, and screenshots for UI-impacting work.
- Request reviewers familiar with DWScript integration when touching `core/` or `wasm/` files.

## WASM & Configuration Tips
- Build DWScript support by running `just wasm` inside the `go-dws` repo, then copy `dwscript.wasm` and `wasm_exec.js` into `wasm/`.
- Rebuild whenever Go code changes because large binaries stay out of git.
- Mock mode (no WASM) is fine for UI tweaks but never for release testing.
