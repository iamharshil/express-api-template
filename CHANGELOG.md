# Changelog

All notable changes to this project will be documented in this file.

## [4.0.0] - 2026-01-04

### 🚀 Major Architecture Overhaul (Functional)
- **Functional Paradigm**: Completely refactored the codebase from class-based to **function-based architecture**.
    - Removed `UserService`, `UserController`, `Bootstrap` classes.
    - Replaced with exported functions and object literals.
- **New Folder Structure**: Adopted a standard, scalable Node.js structure:
    - `src/lib`: Core adapters (DB, Logger).
    - `src/models`: Data access layer (Repositories).
    - `src/middlewares`: Express middlewares (Auth).
    - `src/modules`: Feature logic (Services, Controllers).
    - `src/config`: Environment setup and functional Dependency Injection (`setup.ts`).
- **Improved Presets**:
    - **Database**: Mongo and Postgres presets now export functional repositories.
    - **Auth**: JWT and API Key auth rewritten as pure functional middlewares.
- **Assembler 2.0**: Updated `Assembler.js` to dynamically generate the functional `setup.ts` wiring.

### ✨ Other Improvements
- **Pre-generated JS**: JavaScript project generation is now robust and compilation-free for end users.
- **Strict Types**: Enhanced TypeScript configuration and linting.
- **Cleanup**: Removed legacy `src/shared` and `src/infra` directories.

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
