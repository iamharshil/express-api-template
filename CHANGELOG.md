# Changelog

All notable changes to this project will be documented in this file.

## [4.0.0] - 2026-01-04

### 🚀 Major Changes
- **Separate Server & App**: Refactored the entry point logic.
    - `src/app.ts` (or `.js`): Only configures the Express app and exports it. No side effects.
    - `src/server.ts` (or `.js`): New entry point that handles bootstrapping and starts the server via `app.listen`.
    - `npm start` and `npm run dev` now point to `src/server`.
- **Pre-generated JS Templates**: JavaScript templates are now generated ahead of time (during template build) rather than compiled on-the-fly, improving stability and removing TypeScript-related artifacts from JS projects.

### ✨ Improvements
- **Security**: Fixed a `spawn` deprecation warning (DEP0190) during dependency installation by optimizing shell usage.
- **DX**: Enhanced clean output and error handling during installation.
- **Structure**: Moved `app.ts` to `src/` root for better visibility.

## [3.3.0] - 2026-01-04

### 🚀 Major Features
- **Modular Architecture**: Completely refactored the template to a "Base + Presets" model where features are pluggable.
- **Dynamic Assembly**: Introduced `Assembler.js` to dynamically generate projects by merging base functionality with selected presets.
- **Language Support**: Added support for generating **JavaScript** projects by compiling the TypeScript source on-the-fly.
- **Package Manager Selection**: Users can now choose `npm`, `yarn`, `pnpm`, or `bun` for installation.

### ✨ CLI Improvements
- **Interactive Prompts**: Replaced basic input with `inquirer` for a richer user experience (Select lists, confirmations).
- **Project Summary**: Added a confirmation summary step before project creation.
- **Granular Feedback**: Added real-time spinners for each build step (Copying, Compiling, Installing).
- **Smart Instructions**: Final output now provides context-aware "Next Steps" (e.g., specific `.env` reminders, correct `pnpm` commands).
- **Rich Help**: Updated `--help` flag to display detailed feature descriptions.

### 🐛 Fixes
- Replaced legacy `createDirectoryContents.js` with robust `Assembler` class.
- Fixed template structural inconsistencies by enforcing strict interface-based decoupling.
- Silenced internal build logs to prevent CLI UI corruption.

## [3.2.0] - Previous Version
- Initial TypeScript support and basic structure.
