<p align="center">
  <img src="https://img.shields.io/github/v/release/iamharshil/express-api-template?style=for-the-badge&color=blue" alt="Release" />
  <img src="https://img.shields.io/npm/dt/express-api-template?style=for-the-badge&color=green" alt="Downloads" />
  <img src="https://img.shields.io/github/license/iamharshil/express-api-template?style=for-the-badge" alt="License" />
  <img src="https://img.shields.io/github/stars/iamharshil/express-api-template?style=for-the-badge&color=yellow" alt="Stars" />
</p>

<h1 align="center">🚀 Express API Template</h1>

<p align="center">
  <strong>A production-ready CLI to scaffold Express.js APIs in seconds</strong>
</p>

<p align="center">
  Skip the boilerplate. Start building. Choose your language. Pick your architecture.
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔷 **TypeScript & JavaScript** | Full support for both languages—you choose |
| 🏗️ **MVC or Scalable Architecture** | Classic Model-View-Controller or modern modular structure |
| 🍃 **MongoDB Ready** | Pre-configured MongoDB connection with Mongoose |
| 📂 **Smart Project Structure** | Organized folders for controllers, routes, models, and utilities |
| 🔧 **ESLint + Prettier + Biome** | Code quality tools configured out of the box |
| 📦 **Auto Dependency Install** | Optional automatic `npm install` during setup |
| 🎯 **Interactive CLI** | Guided prompts for a smooth setup experience |

---

## 📦 Quick Start

```bash
npx express-api-template
```

That's it! The CLI will guide you through:

1. **Project name** — Name your project folder
2. **Architecture** — Choose MVC or Scalable (Modular)
3. **Language** — JavaScript or TypeScript
4. **Dependencies** — Auto-install packages or do it yourself

---

## 🏗️ Project Structures

### MVC (Model-View-Controller)

Traditional, battle-tested architecture ideal for small to medium projects.

```
my-project/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── models/          # Mongoose schemas
├── routers/         # Express routes
├── utils/           # Helper functions
├── lib/             # Shared libraries
├── index.js         # Entry point
└── .env             # Environment variables
```

### Scalable (Modular)

Feature-based architecture designed for large, maintainable codebases.

```
my-project/
├── src/
│   ├── modules/     # Feature modules (users, auth, etc.)
│   ├── common/      # Shared utilities
│   ├── config/      # App configuration
│   └── index.ts     # Entry point
├── tsconfig.json    # TypeScript config (if applicable)
└── .env             # Environment variables
```

---

## 🚀 After Installation

```bash
# Navigate to your project
cd my-project

# Set up environment variables
cp .env.example .env  # Edit with your config

# Start development server
npm run dev
```

---

## 🛠️ Included Tools

| Tool | Purpose |
|------|---------|
| [ESLint](https://eslint.org/) | Linting and code standards |
| [Prettier](https://prettier.io/) | Code formatting |
| [Biome](https://biomejs.dev/) | Fast formatter & linter |
| [Mongoose](https://mongoosejs.com/) | MongoDB object modeling |
| [dotenv](https://github.com/motdotla/dotenv) | Environment variable management |

---

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |
| `npm run format` | Format code with Prettier/Biome |

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  <strong>Built with ❤️ by Harshil</strong>
</p>

<p align="center">
  <a href="https://github.com/iamharshil">
    <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://www.linkedin.com/in/harshil-chudasama">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="https://instagram.com/iam_harshil">
    <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="Instagram" />
  </a>
</p>

<p align="center">
  ⭐ Star this repo if you find it useful!
</p>
