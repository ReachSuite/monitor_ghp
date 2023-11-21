# monitor_ghp

Monitor and Test Golden Happy Path experiences

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

# Run specific tests

```sh
pnpm exec playwright test --grep @<customer_name>
```

Example:

```sh
pnpm exec playwright test --grep @biglittle
```

## Open the headed mode

```sh
pnpm exec playwright test --grep @<customer_name> --ui
```

## Example:

```sh
pnpm exec playwright test --grep @biglittle --ui
```

## Run specific browsers

By using projects you can run your tests in multiple browsers such as chromium, webkit and firefox as well as branded browsers such as Google Chrome and Microsoft Edge

```sh
pnpm exec playwright test --grep @<customer_name> --project=firefox
```

Example:

```sh
pnpm exec playwright test --grep @biglittle --project=firefox
```

## Display test report

```sh
pnpm exec playwright show-report
```

# Monitoring Infrastructure

This project uses Pulumi, ensure you have an account created and your AWS credentials properly configured.
Read more about getting started with Pulumi and AWS [here](https://www.pulumi.com/docs/clouds/aws/get-started/begin/)

Install pulumi cli

```sh
brew install pulumi/tap/pulumi
```

Check if Pulumi is properly installed:

```sh
pulumi version
```

## Deploy to development stack

The following command will install all required dependencies and deploy all the required infrastructure to AWS:

```sh
pnpm run monitoring:deploy:dev
```

## Destroy development stack

If you want / need to recreate the infrastructure, run:

```sh
pnpm run monitoring:destroy:dev
```
