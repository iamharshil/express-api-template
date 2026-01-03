# How to release new package

1. Commit latest code changes
2. Run `npm run release` and select version based on what kind of update it is.
3. Then `np` will automatically handle it.

## Test locally

1. Do `npm link` on current package.
2. Run `npx template-cli` where you want to test this project.

## Remove Beta/Canary

1. Do `npm dist-tag rm express-api-template canary`
2. Do `npm dist-tag rm express-api-template beta`

## Remove specific version

- Do `npm unpublish express-api-template@4.0.4-0`
