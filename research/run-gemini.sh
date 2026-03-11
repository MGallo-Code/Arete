#!/bin/bash
# Launch 5 Gemini CLI research agents in parallel
# Run from project root: ./research/run-gemini.sh

DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT="$(dirname "$DIR")"

cd "$PROJECT"

echo "Launching 5 Gemini research agents..."
echo "Results will be written to research/findings/"
echo ""

# --yolo auto-approves file reads/writes so agents can work unattended

gemini --yolo -p "$(cat research/prompts/agent-1-inputs.md | sed 's/AGENT_SECTION/Gemini/g')" \
  &
PID1=$!

gemini --yolo -p "$(cat research/prompts/agent-2-layout.md | sed 's/AGENT_SECTION/Gemini/g')" \
  &
PID2=$!

gemini --yolo -p "$(cat research/prompts/agent-3-properties.md | sed 's/AGENT_SECTION/Gemini/g')" \
  &
PID3=$!

gemini --yolo -p "$(cat research/prompts/agent-4-blocks.md | sed 's/AGENT_SECTION/Gemini/g')" \
  &
PID4=$!

gemini --yolo -p "$(cat research/prompts/agent-5-visual.md | sed 's/AGENT_SECTION/Gemini/g')" \
  &
PID5=$!

echo "Agent PIDs: $PID1 $PID2 $PID3 $PID4 $PID5"
echo "Waiting for all agents to finish..."
wait $PID1 $PID2 $PID3 $PID4 $PID5
echo ""
echo "All Gemini agents complete. Check research/findings/ for results."
