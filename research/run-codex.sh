#!/bin/bash
# Launch 5 Codex CLI research agents in parallel
# Run from project root: ./research/run-codex.sh

DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT="$(dirname "$DIR")"

cd "$PROJECT"

echo "Launching 5 Codex research agents..."
echo "Results will be written to research/findings/"
echo ""

# codex exec = non-interactive mode
# Codex runs sandboxed by default; it can read/write files in the project

codex exec "$(cat research/prompts/agent-1-inputs.md | sed 's/AGENT_SECTION/Codex/g')" \
  &
PID1=$!

codex exec "$(cat research/prompts/agent-2-layout.md | sed 's/AGENT_SECTION/Codex/g')" \
  &
PID2=$!

codex exec "$(cat research/prompts/agent-3-properties.md | sed 's/AGENT_SECTION/Codex/g')" \
  &
PID3=$!

codex exec "$(cat research/prompts/agent-4-blocks.md | sed 's/AGENT_SECTION/Codex/g')" \
  &
PID4=$!

codex exec "$(cat research/prompts/agent-5-visual.md | sed 's/AGENT_SECTION/Codex/g')" \
  &
PID5=$!

echo "Agent PIDs: $PID1 $PID2 $PID3 $PID4 $PID5"
echo "Waiting for all agents to finish..."
wait $PID1 $PID2 $PID3 $PID4 $PID5
echo ""
echo "All Codex agents complete. Check research/findings/ for results."
