#!/bin/bash
# Launch 5 Codex CLI research agents in parallel
# Run from project root: ./research/run-codex.sh

DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT="$(dirname "$DIR")"

cd "$PROJECT"

echo "Launching 5 Codex research agents..."
echo "Results will be written to research/findings/"
echo ""

# gpt-5.2-codex works with ChatGPT accounts

codex exec -c model="gpt-5.2-codex" \
  "$(cat research/prompts/agent-1-inputs.md | sed 's/AGENT_SECTION/Codex/g') Also read research/instructions.md for full context." \
  &
PID1=$!

codex exec -c model="gpt-5.2-codex" \
  "$(cat research/prompts/agent-2-layout.md | sed 's/AGENT_SECTION/Codex/g') Also read research/instructions.md for full context." \
  &
PID2=$!

codex exec -c model="gpt-5.2-codex" \
  "$(cat research/prompts/agent-3-properties.md | sed 's/AGENT_SECTION/Codex/g') Also read research/instructions.md for full context." \
  &
PID3=$!

codex exec -c model="gpt-5.2-codex" \
  "$(cat research/prompts/agent-4-blocks.md | sed 's/AGENT_SECTION/Codex/g') Also read research/instructions.md for full context." \
  &
PID4=$!

codex exec -c model="gpt-5.2-codex" \
  "$(cat research/prompts/agent-5-visual.md | sed 's/AGENT_SECTION/Codex/g') Also read research/instructions.md for full context." \
  &
PID5=$!

echo "Agent PIDs: $PID1 $PID2 $PID3 $PID4 $PID5"
echo "Waiting for all agents to finish..."
wait $PID1 $PID2 $PID3 $PID4 $PID5
echo ""
echo "All Codex agents complete. Check research/findings/ for results."
