#!/bin/bash
# Claude Code - Local Runner
# Based on: https://x.com/joy014/status/2038914432831815793

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLI="$SCRIPT_DIR/dist/cli.js"

if [ ! -f "$CLI" ]; then
    echo "Error: cli.js not found at $CLI"
    exit 1
fi

# Pass all arguments through to the CLI
node "$CLI" "$@"
