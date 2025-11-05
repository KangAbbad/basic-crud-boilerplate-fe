# Planning Workflow

## Phase 1: Discovery & Analysis
1. External Research - Context7/Firecrawl as needed
2. Documentation Review - code standards, past refactors
3. Impact Analysis - affected files, dependencies, risks

## Phase 2: Plan Creation
1. Categorize by layer (Type → Service → Hook → Component → Route → Utility)
2. List ALL files explicitly with verification steps
3. Document approach, architectural decisions

## Phase 3: Implementation
- Execute by category priority
- Update progress after each completion
- Run `bun typecheck` after each category

## Feature Plans
Include in `/docs/feature-plan/{YYYYMMDD}/{topic}/README.md`:
- Overview - feature purpose, goals
- Requirements - functional, technical requirements
- Technical design - architecture, libraries, patterns
- File organization - new files to create by layer
- Dependencies - external libraries, APIs
- All affected files with changes
- Implementation steps by layer
- Progress tracking with ✅ timestamps

## Refactoring Plans
Include in `/docs/refactor-plan/{YYYYMMDD}/{topic}/README.md`:
- Current state, problems
- Proposed changes
- All affected files
- Migration strategy
- Risks, mitigation
- Progress tracking

## Feature Changes

**Adding New:** Create feature plan with requirements, design, file organization, dependencies

**Improving Existing:** Create refactor plan with analysis, enhancements, affected files, strategy

**Removing Part:** Create refactor plan with impact assessment, safe removal process using search tools

**Removing Entire:** Create refactor plan with complete file list, cleanup strategy, verification
