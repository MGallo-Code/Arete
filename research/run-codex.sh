#!/bin/bash
# Launch Codex CLI research agents in parallel
# Usage: ./research/run-codex.sh prompt1.md prompt2.md ...
#        ./research/run-codex.sh research/prompts/wave3-*.md
#
# Each prompt file gets its own agent. AGENT_SECTION is auto-replaced with "Codex".
# If no args, runs the original 5 research prompts.

DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT="$(dirname "$DIR")"
cd "$PROJECT"

AGENT="Codex"

# Default to original prompts if no args
if [ $# -eq 0 ]; then
  set -- research/prompts/agent-*.md
fi

echo "Launching $# Codex agent(s)..."
echo ""

PIDS=()
for PROMPT_FILE in "$@"; do
  if [ ! -f "$PROMPT_FILE" ]; then
    echo "  SKIP: $PROMPT_FILE (not found)"
    continue
  fi
  echo "  → $PROMPT_FILE"
  codex exec -c model="gpt-5.2-codex" \
    "$(sed "s/AGENT_SECTION/$AGENT/g" < "$PROMPT_FILE") Also read research/instructions.md for full context." \
    &
  PIDS+=($!)
done

echo ""
echo "Agent PIDs: ${PIDS[*]}"
echo "Waiting for all agents to finish..."
wait "${PIDS[@]}"
echo ""
echo "All Codex agents complete."
