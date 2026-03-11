#!/bin/bash
# Launch Claude Code research agents in parallel
# Usage: ./research/run-claude.sh prompt1.md prompt2.md ...
#        ./research/run-claude.sh research/prompts/wave3-*.md
#
# Each prompt file gets its own agent. AGENT_SECTION is auto-replaced with "Claude".
# If no args, runs the original 5 research prompts.

DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT="$(dirname "$DIR")"
cd "$PROJECT"

AGENT="Claude"

# Default to original prompts if no args
if [ $# -eq 0 ]; then
  set -- research/prompts/agent-*.md
fi

echo "Launching $# Claude agent(s)..."
echo ""

PIDS=()
for PROMPT_FILE in "$@"; do
  if [ ! -f "$PROMPT_FILE" ]; then
    echo "  SKIP: $PROMPT_FILE (not found)"
    continue
  fi
  echo "  → $PROMPT_FILE"
  claude -p "$(sed "s/AGENT_SECTION/$AGENT/g" < "$PROMPT_FILE")" \
    --allowedTools "Read,Glob,Grep,Write,Edit,WebSearch,WebFetch" \
    &
  PIDS+=($!)
done

echo ""
echo "Agent PIDs: ${PIDS[*]}"
echo "Waiting for all agents to finish..."
wait "${PIDS[@]}"
echo ""
echo "All Claude agents complete."
