# Express API Template

![License](https://img.shields.io/npm/l/express-api-template)
![Version](https://img.shields.io/npm/v/express-api-template)
![Build Status](https://img.shields.io/github/actions/workflow/status/iamharshil/express-api-template/test.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

A production-ready, functional **Express.js boilerplate generator**.  
Instant scaffolding for scalable, type-safe, and modern Node.js backends.

## Features

- **Functional Architecture**: Pure functions, no unnecessary classes.
- **Type-Safe**: Built with TypeScript 5.0+ and Zod for validation.
- **Modular Structure**: Organized by features (`src/modules`) and layers (`src/models`, `src/lib`).
- **Flexible Presets**:
  - **Database**: MongoDB (Mongoose) or PostgreSQL (pg).
  - **Auth**: JWT, API Key, or None.
- **Developer Experience**:
  - **Hot Reload**: Pre-configured `tsx` / `nodemon`.
  - **Testing**: Vitest setup out of the box.
  - **Linting**: Biome/ESLint ready.

## Quick Start

Generate a new project interactively:

```bash
npx express-api-template@latest my-app
```

Or specify options via flags:

```bash
npx express-api-template my-app --language=typescript --database=postgresql --auth=jwt
```

## Project Structure

The generated project follows a clean, functional separation of concerns:

```
src/
├── config/           # Environment & Dependency Injection
├── lib/              # Core Adapters (DB, Logger)
├── middlewares/      # Express Middlewares
├── models/           # Data Access Layer (Repositories)
├── modules/          # Feature Logic (Services, Controllers, Routes)
│   └── user/
├── utils/            # Shared Helpers
├── app.ts            # App Configuration
└── server.ts         # Entry Point
```

## Development

To work on this template generator locally:

1. **Clone**: `git clone https://github.com/iamharshil/express-api-template.git`
2. **Install**: `npm install`
3. **Test**:
   - `npm run test:smoke`: Validates basic generation and build.
   - `npm run test:matrix`: Validates all 18 permutations.

## License

MIT © [Harshil](https://github.com/iamharshil)
