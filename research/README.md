# Editor UI Research

## Quick Start

Make scripts executable first:
```bash
chmod +x research/run-claude.sh research/run-gemini.sh research/run-codex.sh
```

### Run Claude (5 agents)
```bash
./research/run-claude.sh
```

### Run Gemini (5 agents)
```bash
./research/run-gemini.sh
```

### Run Codex (5 agents)
```bash
./research/run-codex.sh
```

### Run all three platforms (15 agents total)
```bash
./research/run-claude.sh &
./research/run-gemini.sh &
./research/run-codex.sh &
wait
```

### Run a single agent manually
```bash
# Claude — replace agent number and section name
claude -p "$(cat research/prompts/agent-1-inputs.md | sed 's/AGENT_SECTION/Claude/g')"

# Gemini
gemini -p "$(cat research/prompts/agent-2-layout.md | sed 's/AGENT_SECTION/Gemini/g')"

# Codex
codex -q "$(cat research/prompts/agent-3-properties.md | sed 's/AGENT_SECTION/Codex/g')"
```

## Structure

```
research/
├── instructions.md              # Master brief (full context for all agents)
├── README.md                    # This file
├── run-claude.sh                # Launch 5 Claude agents
├── run-gemini.sh                # Launch 5 Gemini agents
├── run-codex.sh                 # Launch 5 Codex agents
├── prompts/
│   ├── agent-1-inputs.md        # Input Controls & Interactions
│   ├── agent-2-layout.md        # Panel Layout & Density
│   ├── agent-3-properties.md    # Property Coverage + Theme Controls
│   ├── agent-4-blocks.md        # Block Layout + Content Editing
│   └── agent-5-visual.md        # Visual Design + Open Discovery
└── findings/
    ├── input-controls.md        # Area 1 findings
    ├── panel-layout.md          # Area 2 findings
    ├── property-coverage.md     # Area 3 findings
    ├── block-layout.md          # Area 4 findings
    ├── content-editing.md       # Area 5 findings
    ├── theme-controls.md        # Area 6 findings
    └── visual-design.md         # Area 7 findings
```

## Agent Assignments

| Agent | Areas | Findings Files |
|-------|-------|----------------|
| 1 | Input Controls & Interactions | `input-controls.md` |
| 2 | Panel Layout & Density | `panel-layout.md` |
| 3 | Property Coverage + Theme Controls | `property-coverage.md`, `theme-controls.md` |
| 4 | Block Layout + Content Editing | `block-layout.md`, `content-editing.md` |
| 5 | Visual Design + Open Discovery | `visual-design.md` (+ cross-cutting) |

Each findings file has sections for `### Claude`, `### Gemini`, `### Codex`, and `### Other` under "Agent Findings" — each platform's agents write to their own section.

## Notes

- **CLI flags may vary** — check your installed versions of `claude`, `gemini`, and `codex` and adjust the runner scripts if needed.
- **Concurrent writes** — agents within the same platform write to different files (by assignment), so there shouldn't be conflicts. Across platforms, agents write to different sections within the same file, which could conflict if run simultaneously. Run one platform at a time to be safe, or accept minor merge conflicts.
- **No code changes** — agents are instructed to research only. If an agent tries to modify source code, something went wrong.
