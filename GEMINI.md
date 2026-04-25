# Project Instructions: August Writing

## Workflow Conventions
- **Redux Persistence**: When updating hardcoded initial state in `collectionsSlice.ts` or any other slice that is persisted, ALWAYS bump the `version` in `src/store/index.ts`. This ensures that existing users see the new data instead of their old cached local storage state.
