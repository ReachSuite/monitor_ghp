# monitor_ghp

Monitor and Test  Golden Happy Path experiences

# Project dependencies

This project requires Node.js 18.12.1 and pnpm 7.26.0

You can use [volta](https://volta.sh/) to install specific Node.js versions

## Install volta (Optional)

```sh
curl https://get.volta.sh | bash
```

Install specific Node.js version

```sh
volta install node@18.12.1
```

## Install pnpm 7.26.0

```sh
curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=7.26.0 sh -
```

# Run tests

## Runs the end-to-end tests

```sh
pnpm exec playwright test
```

## Starts the interactive UI mode.

```sh
pnpm exec playwright test --ui
```

Runs the tests only on Desktop Chrome.

```sh
pnpm exec playwright test --project=chromium
```

Runs the tests in a specific file.

```sh
pnpm exec playwright test example
```

# Run specific custom tests

```sh
pnpm exec playwright test --grep @revsure --ui
```

```sh
pnpm exec playwright test --grep @biglittle
```

```sh
pnpm exec playwright show-report
```
