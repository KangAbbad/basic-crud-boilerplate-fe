# Agent Development Guidelines

## ⚠️ MANDATORY EXECUTION CHECKLIST - EVERY REQUEST

**Before ANY coding work, complete these steps in order:**

1. ☐ Read all files in `/docs/code-standard/`
2. ☐ Create/update TodoWrite with task breakdown and workflow steps
3. ☐ Audit scope comprehensively (don't fix piecemeal)
4. ☐ Only after all above: proceed to implementation

**Non-Negotiable Rules:**
- Never skip `/docs/code-standard/` reading before coding
- Never fix issues one-by-one without comprehensive scope audit
- Always create TodoWrite for multi-step tasks
- Always display token usage in work summary. Format: "Token usage: X/200000 (X%)"

**Version Control:** Don't auto-commit/PR. Group related changes

## Communication Style

**Extreme Conciseness Required**
- Drop articles, filler words
- Use fragments: "Updated 3 files. Typecheck passed. Done."
- Report external resources consulted

**Auto-Use External Resources**
- Context7 for library docs BEFORE asking user
- Firecrawl for best practices BEFORE saying "don't know"
- Fetch info proactively, don't guess

**MCP Tools:** See `/docs/mcp-tool-usage.md` for detailed tool usage guide (Context7, Firecrawl, Sequential Thinking)

## Development Workflow

**Type Checking:**
- Run `bun typecheck` after code changes (TypeScript, JavaScript, TSX, JSX)
- Skip for: docs (.md), README, AGENTS.md, .gitignore, assets
- Custom `/lib/` changes: `bun i && yarn && bun typecheck`

**Don't run:** `bun dev` or `bun run build` for validation

## Documentation Standards

**Locations:**
- All docs: `/docs/`
- Feature plans: `/docs/feature-plan/{YYYYMMDD}/{topic-name}/README.md`
- Refactor plans: `/docs/refactor-plan/{YYYYMMDD}/{topic-name}/README.md`
- Code standards: `/docs/code-standard/`

**Progress Tracking (Required):**
- Update after each significant completion
- Mark ✅, add timestamps, note fixes
- List ALL files explicitly (no placeholders)
- Use category-based organization

**Categories:**
1. Type Layer - interfaces, types
2. Service Layer - API functions
3. Hook Layer - custom hooks
4. Component Layer - UI components
5. Route Layer - pages
6. Utility Layer - helpers

**Planning Workflow:** See `/docs/planning-workflow.md` for detailed planning phases, feature plans, and refactoring plans

## Testing Policy

No unit tests unless explicitly requested. Validate via typecheck only.
