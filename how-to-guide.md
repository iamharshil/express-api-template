# How to release new package

1. Commit latest code changes
2. Run `npm run release` and select version based on what kind of update it is.
3. Then `np` will automatically handle it.

# Test locally.

1. Do `npm link` on current package.
2. Run `npx template-cli` where you want to test this project.
