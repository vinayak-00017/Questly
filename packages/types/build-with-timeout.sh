#!/bin/bash

# Build script with timeout protection for @questly/types
# This prevents hanging builds that can waste CI resources

TIMEOUT_SECONDS=120  # 2 minutes timeout
BUILD_CMD="tsup --config tsup.config.ts"

echo "🏗️  Starting @questly/types build with ${TIMEOUT_SECONDS}s timeout..."

# Run build with timeout
if timeout $TIMEOUT_SECONDS $BUILD_CMD; then
    echo "✅ Build completed successfully"
    exit 0
else
    EXIT_CODE=$?
    if [ $EXIT_CODE -eq 124 ]; then
        echo "❌ Build timed out after ${TIMEOUT_SECONDS} seconds"
        echo "This prevents resource waste in CI environments"
        exit 1
    else
        echo "❌ Build failed with exit code $EXIT_CODE"
        exit $EXIT_CODE
    fi
fi
