# CRUD Boilerplate Documentation

Comprehensive guide for building CRUD features based on actual carts implementation.

---

## 📚 Documentation Sections

### Core Architecture
1. [**Overview & Architecture**](./overview.md) - Layered structure, file organization
2. [**Type Layer**](./type-layer.md) - Zod v4-mini schemas, DTOs
3. [**Store Layer**](./store-layer.md) - Legend State observables, actions, hooks
4. [**Persistence Layer**](./persistence-layer.md) - IndexedDB storage patterns

### Implementation Details
5. [**Route Layer**](./route-layer.md) - List & form page patterns
6. [**Input Fields**](./input-fields.md) - 7 special field types with utilities
7. [**Form Patterns**](./form-patterns.md) - React Hook Form initialization & submission
8. [**Hook Patterns**](./hook-patterns.md) - 5 common hook patterns (filters, modals, calculations)

### Reference
9. [**Checklist**](./checklist.md) - Step-by-step implementation guide
10. [**Best Practices**](./best-practices.md) - Quick reference summary

---

## 🚀 Quick Start

1. **Read Overview** → Understand layered architecture
2. **Follow Checklist** → Create types → store → persistence → components → forms
3. **Reference Input Fields** → Copy special field implementations
4. **Use Hook Patterns** → Choose appropriate hook pattern for your use case
5. **Run Typecheck** → `bun typecheck` after each major step

---

## 🔍 Find What You Need

| Need | Go To |
|------|-------|
| Schema structure | [Type Layer](./type-layer.md) |
| State management | [Store Layer](./store-layer.md) |
| Phone/number inputs | [Input Fields](./input-fields.md) |
| Form setup | [Form Patterns](./form-patterns.md) |
| URL-synced filters | [Hook Patterns](./hook-patterns.md) |
| Implementation order | [Checklist](./checklist.md) |

---

## 📖 Reading Order

**For new features**: Follow documentation order (Overview → Type → Store → Persistence → Route → Input Fields → Forms → Hooks)

**For specific problems**: Jump directly to relevant section using table above

---

## 📝 Examples Based On

All patterns extracted from production carts feature (`app/routes/_root.carts.*`):

- ✅ Actual working code
- ✅ No improvisation
- ✅ Production-tested patterns
- ✅ Follows all code standards

---

[Start Reading →](./overview.md)
