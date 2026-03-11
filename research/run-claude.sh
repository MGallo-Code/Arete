#!/bin/bash
# Launch 5 Claude Code research agents in parallel
# Run from project root: ./research/run-claude.sh

DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT="$(dirname "$DIR")"

cd "$PROJECT"

echo "Launching 5 Claude research agents..."
echo "Results will be written to research/findings/"
echo ""

# Each agent reads its prompt file and writes findings
# --dangerously-skip-permissions lets agents read/write without prompts
# Remove that flag if you want to approve each file write

claude -p "$(cat research/prompts/agent-1-inputs.md | sed 's/AGENT_SECTION/Claude/g')" \
  --allowedTools "Read,Glob,Grep,Write,Edit,WebSearch,WebFetch" \
  &
PID1=$!

claude -p "$(cat research/prompts/agent-2-layout.md | sed 's/AGENT_SECTION/Claude/g')" \
  --allowedTools "Read,Glob,Grep,Write,Edit,WebSearch,WebFetch" \
  &
PID2=$!

claude -p "$(cat research/prompts/agent-3-properties.md | sed 's/AGENT_SECTION/Claude/g')" \
  --allowedTools "Read,Glob,Grep,Write,Edit,WebSearch,WebFetch" \
  &
PID3=$!

claude -p "$(cat research/prompts/agent-4-blocks.md | sed 's/AGENT_SECTION/Claude/g')" \
  --allowedTools "Read,Glob,Grep,Write,Edit,WebSearch,WebFetch" \
  &
PID4=$!

claude -p "$(cat research/prompts/agent-5-visual.md | sed 's/AGENT_SECTION/Claude/g')" \
  --allowedTools "Read,Glob,Grep,Write,Edit,WebSearch,WebFetch" \
  &
PID5=$!

echo "Agent PIDs: $PID1 $PID2 $PID3 $PID4 $PID5"
echo "Waiting for all agents to finish..."
wait $PID1 $PID2 $PID3 $PID4 $PID5
echo ""
echo "All Claude agents complete. Check research/findings/ for results."
