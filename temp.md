# Express API Template – Architecture & Preset System

This document explains **from scratch to end** how the `express-api-template` works internally: what options users can choose, how templates are composed, and what each folder and file is responsible for.

The goal of this system is **maximum flexibility with minimum maintenance**.

---

## 1. Core Design Philosophy

This template is built on three non‑negotiable principles:

1. **TypeScript is the source of truth**
   JavaScript is always generated from TypeScript. JS is never hand‑maintained.

2. **One base template, many presets**
   We never duplicate full project structures. We compose features.

3. **Orthogonal concerns**

   * Language (TS / JS)
   * Architecture (scalable / MVC‑style)
   * Authentication (JWT / API key / none)
   * Database (MongoDB / PostgreSQL / none)

   These choices are independent and can be combined freely.

---

## 2. High‑Level Folder Structure

```
templates/
  base/
    src/
      config/
      shared/
      modules/
    package.json
    tsconfig.json

  presets/
    mvc/
    auth-jwt/
    auth-apikey/
    auth-none/
    db-mongodb/
    db-postgresql/
    js-runtime/
```

* `base/` → the **only real template**
* `presets/` → optional, composable feature packs

---

## 3. Base Template (`templates/base`)

The base template defines **contracts, structure, and rules**. It contains no database‑specific or auth‑specific implementations.

### 3.1 `src/config/`

Responsible for application startup and wiring.

```
src/config/
  env.ts          // environment validation
  bootstrap.ts    // dependency wiring (extended by presets)
  app.ts          // express app setup
```

`bootstrap.ts` is the **only place** where presets are allowed to register implementations.

---

### 3.2 `src/shared/`

Shared infrastructure and contracts.

```
src/shared/
  auth/
    AuthProvider.ts
    AuthContext.ts
    index.ts

  repositories/
    UserRepository.ts
    ApiKeyRepository.ts

  errors/
  logger/
```

Important rules:

* No Mongo, Postgres, JWT, or API key code here
* Only interfaces and cross‑cutting utilities

---

### 3.3 `src/modules/`

Feature‑based application logic.

```
src/modules/
  user/
    user.controller.ts
    user.service.ts
    user.routes.ts

  auth/
    auth.controller.ts
    auth.routes.ts
```

Rules:

* Controllers handle HTTP only
* Services contain business logic
* Modules never import DB or auth implementations

---

## 4. Preset System

A **preset** is a small, isolated unit that adds:

* Files
* Registrations
* Minimal mutations

Presets never:

* Know about other presets
* Change architecture
* Add conditional logic

---

## 5. Database Presets

### 5.1 MongoDB Preset (`presets/db-mongodb`)

Adds MongoDB infrastructure.

```
presets/db-mongodb/
  files/
    src/infra/db/mongo.ts
    src/infra/repositories/MongoUserRepository.ts
    src/infra/repositories/MongoApiKeyRepository.ts

  mutations/
    bootstrap.ts
```

**What it does:**

* Implements repository interfaces
* Registers them in `bootstrap.ts`

It does NOT:

* Touch auth logic
* Change routes

---

### 5.2 PostgreSQL Preset (`presets/db-postgresql`)

Same structure, different implementation.

```
presets/db-postgresql/
  files/
    src/infra/db/postgres.ts
    src/infra/repositories/PostgresUserRepository.ts
    src/infra/repositories/PostgresApiKeyRepository.ts

  mutations/
    bootstrap.ts
```

Both DB presets satisfy the same repository contracts.

---

## 6. Authentication Presets

### 6.1 JWT Auth (`presets/auth-jwt`)

```
presets/auth-jwt/
  files/
    src/infra/auth/JwtAuthProvider.ts
    src/modules/auth/

  mutations/
    bootstrap.ts
```

**Responsibilities:**

* Verify access & refresh tokens
* Produce a normalized `AuthContext`
* Bind `AuthProvider`

JWT works with **any database** because it depends only on repository interfaces.

---

### 6.2 API Key Auth (`presets/auth-apikey`)

```
presets/auth-apikey/
  files/
    src/infra/auth/ApiKeyAuthProvider.ts

  mutations/
    bootstrap.ts
```

Used for:

* Public APIs
* Service‑to‑service auth

Also DB‑agnostic.

---

### 6.3 No Auth (`presets/auth-none`)

Provides a `NoAuthProvider` that always returns an anonymous context.

Useful for:

* Public APIs
* Prototypes
* Internal services

---

## 7. MVC Preset (`presets/mvc`)

MVC is **not the default architecture**.

The MVC preset:

* Simplifies module structure
* Reduces service layering
* Keeps Express‑style controllers

Used for:

* Beginners
* Small apps
* Learning purposes

Scalable architecture remains the default.

---

## 8. Language Handling (TS → JS)

### 8.1 TypeScript (Default)

When user selects **TypeScript**:

* `templates/base` is copied directly
* Presets are applied
* TS tooling is kept

---

### 8.2 JavaScript (Generated)

When user selects **JavaScript**:

1. Base + presets are assembled in TypeScript
2. `tsc` compiles TS → JS
3. Output JS is emitted as final project
4. TS files and tooling are removed

JS users receive **compiled, clean JavaScript**, not a separate template.

---

## 9. Generator Execution Flow

```
copy base → temp
apply db preset
apply auth preset
apply structure preset

if language === js:
  compile TS → JS
  emit JS project
else:
  emit TS project
```

The generator assembles — it does not reason.

---

## 10. Architectural Invariants (Hard Rules)

The template enforces these rules:

* Routes never import auth implementations
* Services never read tokens
* Repositories never know HTTP
* Auth never knows DB type
* Presets never import other presets
* All wiring happens in `bootstrap.ts`

Breaking these rules breaks the system.

---

## 11. Why This Scales

* One codebase to maintain
* Infinite option combinations
* Zero template duplication
* Enterprise‑grade structure
* Beginner‑friendly entry points

---

## 12. Mental Model Summary

* **Base** → contracts + structure
* **Presets** → implementations
* **Bootstrap** → wiring
* **CLI** → assembler

This is how real production systems are designed.

---

End of documentation.
