#!/bin/bash

# This script prepares the Lambda function to be deployed to AWS.

# Change directory to the lambda folder
cd infrastructure/lambda || exit

# Remove existing 'package' directory
rm -rf package

# Install dependencies using pnpm
pnpm i

# Build the lambda code
pnpm run build

# Pack the lambda code into a tarball
pnpm pack

# Extract the tarball
tar -xf reachsuite-lambda-test-suite-1.0.0.tgz

# Remove the original tarball
rm reachsuite-lambda-test-suite-1.0.0.tgz

# Remove all temporary JavaScript files at root level
find . -maxdepth 1 -type f -name "*.js" -exec rm {} \;
