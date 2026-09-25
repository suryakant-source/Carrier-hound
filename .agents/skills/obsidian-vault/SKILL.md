---
name: obsidian-vault
description: Connects, reads, searches, and syncs project documentation, architectural notes, and plans between this workspace and the user's Obsidian vaults (such as D:\Gita, D:\Sadhna Circle\notes, D:\agency). Use when referencing or syncing notes, blueprints, pitch decks, tasks, or knowledge base entries with Obsidian.
---

# Obsidian Vault Connection Skill

This skill defines the integration between this project and the user's local Obsidian vaults.

## Registered Vaults

| Vault Identifier | Absolute Path | Primary Domain / Content |
|---|---|---|
| `Gita` (Active) | `D:\Gita` | **Next-Gen Job Discovery Engine** (`Next-Gen Job Discovery Engine.pptx`), **Bhagavad Gita Platform** (`Bhagavad_Gita_Product_Vision_and_Blueprint_v2.0.md`, Pitch Deck) |
| `Sadhna` | `D:\Sadhna Circle\notes` | Sadhna project notes and emotional architecture |
| `Agency` | `D:\agency` | Agency business operations and Obsidian install base |
| `Website Agency` | `D:\website agency` | Agency client websites and social media projects |
| `DBMS` | `D:\DBMS` | Database designs, queries, and DBMS projects |

## Workflow & Operations

### 1. Direct Vault Access (Fast & Offline)
Because Obsidian vaults are standard local directories with Markdown and JSON files, the agent can directly read and write files using native tools (`view_file`, `write_to_file`, `replace_file_content`, `grep_search`):
- Read project blueprints from `D:\Gita\Bhagavad_Gita_Product_Vision_and_Blueprint_v2.0.md`
- Inspect or create notes in `D:\Gita\` or subfolders
- Use Obsidian-flavored markdown syntax: `[[Note Name]]`, `> [!NOTE]`, and YAML frontmatter properties.

### 2. Live Interaction via Obsidian CLI
When Obsidian is running, you can use the CLI directly:

```bash
# Read a note
obsidian vault="Gita" read file="Bhagavad_Gita_Product_Vision_and_Blueprint_v2.0"

# Search in vault
obsidian vault="Gita" search query="Careerhound" limit=5

# Create a new note from project documentation
obsidian vault="Gita" create name="Careerhound Implementation Notes" content="# Careerhound Status\nSync from workspace." silent

# Append a task or status update
obsidian vault="Gita" append file="Daily Log" content="- [ ] New feature implemented from Carrer-hound repo"
```

### 3. Formatting Guidelines
- Follow the rules in `obsidian-markdown`:
  - Always use `[[wikilinks]]` for internal note links.
  - Add YAML frontmatter for tags, aliases, and metadata.
  - Use callout boxes (`> [!TIP]`, `> [!IMPORTANT]`) for emphasis.
- If creating visual connection maps, use `.canvas` files following the `json-canvas` skill.
