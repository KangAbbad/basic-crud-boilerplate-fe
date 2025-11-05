# MCP Tool Usage Guide

## Tool Usage Priority

### Context7 (Library Documentation)

**Auto-use when:**
- Using unfamiliar library/API
- Need framework documentation (React, TypeScript, Vite, React Router)
- Verifying library capabilities

**Sequence:**
1. `context7___resolve-library-id("package-name")` → get library ID
2. `context7___get-library-docs("/org/project", topic="specific-area")` → fetch docs

### Firecrawl (Web Research)

**Auto-use when:**
- Patterns not in codebase
- Need current best practices (2024+)
- Research solutions to unfamiliar problems

**Tools:**
- `firecrawl_search` - find info across sites (start here)
- `firecrawl_scrape` - extract single page content (fast)
- `firecrawl_map` - discover site URLs
- `firecrawl_crawl` - multi-page extraction (slow, use caution)
- `firecrawl_extract` - structured data extraction

**Workflow:** Search first → review results → scrape specific URLs

**Query tips:** Be specific with technical terms, limit 5-10 results

### Sequential Thinking (Problem Analysis)

**Use for:** complex problem-solving, multi-step planning, design decisions, scope analysis

**When to use:**
- Breaking down complex tasks before implementation
- Planning with room for revision and course correction
- Analyzing problems with initially unclear scope
- Multi-step solutions requiring iterative refinement
- Validating hypotheses or alternative approaches

**Tool:** `sequential-thinking___sequentialthinking`

**Workflow:**
1. Start with initial problem statement
2. Break into logical thinking steps
3. Allow thoughts to build, question, or revise previous insights
4. Track branches when exploring alternatives
5. Generate solution hypothesis when understanding solidifies
6. Verify hypothesis against analysis steps
7. Repeat until satisfied with solution

**Key features:**
- Adjust total_thoughts estimate as understanding deepens
- Mark revisions with `is_revision: true` when reconsidering previous thoughts
- Use `branch_id` to explore alternative approaches
- Set `next_thought_needed: false` only when solution is complete and verified

### Decision Flow

```
1. User requests task
2. Complex/unclear scope? → Sequential Thinking (analyze & plan)
3. Unfamiliar library/API? → Context7
4. Patterns not in codebase? → Firecrawl  
5. Implement with full knowledge
```
