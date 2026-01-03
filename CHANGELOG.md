# Changelog

All notable changes to this project are documented in this file.

## 4.0.0 - 2024-06-15

### Summary

- Major release introducing built-in authentication options and multiple security hardenings.
- All templates now use import syntax and ES modules by default.
- Performance optimizations and dependency updates across the template.
- Code formatting and linting migrated from Rome (deprecated) to Biome.
- Marked issue #8 as resolved (implemented in the [v3.0](https://github.com/iamharshil/express-api-template/releases/tag/v3.0.0) release).

### Security

- Added security middlewares: `helmet`, `express-rate-limit`, `rate-limit-redis`, `csurf`, `xss-clean`, `hpp`.
- Switched password hashing from `bcrypt` to `argon2` for stronger, modern hashing; see the migration notes below.

### Dependencies

- Updated dependencies to the latest stable versions — consult the package manifest for exact versions.

### Notes

- Upgrading from v3.x may require reviewing authentication integration and migrating stored password hashes to Argon2; consider rehashing passwords on next successful login or using a one-time migration script.
- Run tests and verify rate limiting and CSRF configurations after upgrading.
- Review the security middleware defaults and adjust settings (rate limits, CSRF cookie options, CORS, etc.) to match your deployment environment.
