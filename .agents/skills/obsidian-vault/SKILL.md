---
name: obsidian-vault
description: Isolated Obsidian workspace skill for Careerhound. Strictly confined to this project directory (d:\Carrer-hound). Use only for local project notes, blueprints, architecture documentation, and tasks within this folder. External vaults and external folders are strictly prohibited.
---

# Obsidian Vault Connection (Isolated to Carrer-hound)

This skill defines the integration for project documentation and notes strictly confined to the **Careerhound** workspace (`d:\Carrer-hound`).

## Registered Vault

| Vault Identifier | Absolute Path | Primary Domain / Scope |
|---|---|---|
| `Careerhound` (Strictly Isolated) | `d:\Carrer-hound` | Careerhound Job Discovery Engine, ATS scrapers, 3D Radar, architecture, and project docs |

> [!IMPORTANT]
> **STRICT ISOLATION POLICY**:
> - Obsidian is strictly separated and confined ONLY to this folder (`d:\Carrer-hound`).
> - **NEVER** link, search, read, write, or add anything from external folders or external vaults (such as `D:\Gita`, `D:\Sadhna Circle`, `D:\agency`, `D:\website agency`, `D:\DBMS`, etc.).
> - Do not add any other external paths or unrelated projects to this Obsidian workspace.

## Workflow & Operations

### 1. Direct Local Access (Fast & Offline)
All notes, specifications, and architecture documents are saved directly within `d:\Carrer-hound` (e.g., `docs/` or root markdown notes):
- View and create notes using standard markdown tools (`view_file`, `write_to_file`, `replace_file_content`).
- Use Obsidian-flavored markdown syntax: `[[Note Name]]`, `> [!NOTE]`, and YAML frontmatter properties.

### 2. Live Interaction via Obsidian CLI
When Obsidian has this vault open:

```bash
# Read a project note
obsidian vault="Careerhound" read file="Architecture"

# Search within Careerhound only
obsidian vault="Careerhound" search query="ATS scraper" limit=5

# Create a local project note
obsidian vault="Careerhound" create name="Job Engine Specs" content="# Careerhound Specs\nLocal project notes only." silent

# Append a task or status update
obsidian vault="Careerhound" append file="Task Log" content="- [ ] Verified ATS integration"
```

### 3. Formatting Guidelines
- Follow standard Obsidian conventions (`obsidian-markdown`):
  - Use `[[wikilinks]]` for internal note references within this project.
  - Add YAML frontmatter for metadata, tags, and status.
  - Use callout boxes (`> [!TIP]`, `> [!IMPORTANT]`) for key architectural highlights.
  - If creating visual maps, use `.canvas` files following the `json-canvas` skill.
