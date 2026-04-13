#!/bin/bash
# TypeScript type verification script

set -e

echo "Running TypeScript type check..."

cd packages/core
echo "Checking packages/core..."
npx tsc --noEmit

cd ../hooks
echo "Checking packages/hooks..."
npx tsc --noEmit

cd ../../apps/web
echo "Checking apps/web..."
npx tsc --noEmit --incremental

echo "All type checks passed!"
