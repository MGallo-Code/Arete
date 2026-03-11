#!/bin/bash
# Launch Claude, Gemini, and Codex agents in parallel with the same prompts
# Usage: ./research/run-all.sh prompt1.md prompt2.md ...
#        ./research/run-all.sh research/prompts/wave3-*.md
#
# Runs all three CLI scripts with the same prompt files.
# If no args, each script falls back to its default (research/prompts/agent-*.md).

DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Launching all research agents ==="
echo ""

"$DIR/run-claude.sh" "$@" &
PID_CLAUDE=$!

"$DIR/run-gemini.sh" "$@" &
PID_GEMINI=$!

"$DIR/run-codex.sh" "$@" &
PID_CODEX=$!

echo "Waiting for all CLIs to finish..."
echo "  Claude PID: $PID_CLAUDE"
echo "  Gemini PID: $PID_GEMINI"
echo "  Codex  PID: $PID_CODEX"
echo ""

wait $PID_CLAUDE $PID_GEMINI $PID_CODEX
echo ""
echo "=== All research agents complete ==="
