
# 🚀 Express API Template v4.0.0

> Production-ready, modular, and type-safe Express.js API scaffolding for modern developers.

Stop wasting time on boilerplate. Generate a robust, scalable Express API in seconds with your preferred database, authentication strategy, and language (TypeScript/JavaScript).

## ✨ Features

- **🏗 Modular Architecture**: Scalable folder structure separating configuration (`src/config`), capabilities (`src/modules`), and core logic (`src/shared`).
- **🛡 Type-Safe**: Built with **TypeScript** and **Zod** for end-to-end type safety and runtime validation.
- **🔌 Pluggable Presets**:
  - **Database**: MongoDB (Mongoose), PostgreSQL (pg), or None.
  - **Authentication**: JWT (Stateless), API Key, or None.
- **⚡️ Developer Experience**:
  - Interactive CLI with **Inquirer**.
  - Dynamic project assembly using **Assembler**.
  - **Language Selection**: Generate **TypeScript** (Recommended) or **JavaScript** projects.
  - **Package Manager Support**: npm, yarn, pnpm, bun.
- **📦 Production Ready**: Includes `helmet`, `winston` logging, `dotenv` configuration, and standardized error handling.

## 🛠 Usage

Run the CLI directly with `npx`:

```bash
npx express-api-template
```

Follow the interactive prompts to build your perfect stack:

1.  **Project Name**: Choose a folder name.
2.  **Language**: TypeScript or JavaScript.
3.  **Database**: MongoDB, PostgreSQL, or None.
4.  **Authentication**: JWT, API Key, or None.
5.  **Package Manager**: Install dependencies with npm, yarn, pnpm, or bun.

### Quick Start (After Generation)

```bash
cd <project-name>
# If you skipped auto-install:
npm install 

# Start development server
npm run dev
```

## 📂 Project Structure (Modular)

```
src/
├── app.ts            # App configuration (Middleware, Routes export) - No side effects
├── server.ts         # Entry point (Bootstrap, app.listen)
├── config/           # Environment and Bootstrap wiring
├── modules/          # Feature modules (User, Auth, etc.)
├── shared/           # Shared logic (Interfaces, Logger, Errors)
│   ├── auth/         # Auth provider interfaces
│   ├── repositories/ # Data access interfaces
│   └── ...
└── infra/            # Concrete implementations (injected based on presets)
    ├── db/           # Database connections (Mongo/Postgres)
    ├── auth/         # Auth strategies (Jwt/ApiKey)
    └── repositories/ # DB-specific repositories
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © [Harshil Agrawal]
