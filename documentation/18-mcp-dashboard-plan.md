# 18 MCP Dashboard Plan

## Purpose

The MCP dashboard is educational and diagnostic. It explains how AI coding assistants can interact with Angular CLI and workspace tooling. It should not execute arbitrary development commands from the browser.

## Content

| Section | Purpose |
| --- | --- |
| MCP setup checklist | Show what files and editor settings are needed. |
| `.vscode/mcp.json` example | Show a safe example configuration. |
| Codex/Claude prompt examples | Show useful prompts for code generation and analysis. |
| Angular command checklist | Show build, test, generate, and lint commands. |
| OpenAPI generation checklist | Show regenerate and drift-check workflow. |
| Test/build checklist | Show expected quality gates. |
| WebMCP note | Explain future experimental browser demo scope. |

## Example MCP Config

The repository includes `.vscode/mcp.json` for VS Code-compatible MCP clients:

```json
{
  "servers": {
    "angular-cli": {
      "command": "pnpm",
      "args": ["exec", "ng", "mcp"]
    }
  }
}
```

The same server can be started directly with:

```bash
pnpm run mcp:angular
```

This uses the Angular CLI MCP server built into the workspace `@angular/cli` package.

## Important Boundary

The browser dashboard should teach MCP concepts and show commands. It should not run arbitrary workspace commands. If WebMCP is explored later, it should be isolated, experimental, and not required for the core app.

## What This Teaches

- MCP is a development assistant bridge, not a production browser feature.
- Good prompts can encode architecture constraints.
- Tooling dashboards should explain commands before automating them.
