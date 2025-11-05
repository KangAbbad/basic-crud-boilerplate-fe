# Best Practices Summary

[← Checklist](./checklist.md) | [Back to Main](./README.md)

---

## Type Safety

- Use Zod v4-mini for all schemas
- Infer types from schemas
- Never use `any` or `unknown`
- Use "DTO" suffix for data types

---

## Naming Conventions

- Follow all rules in `/docs/code-standard/typescript-rules.md`
- Use "List" suffix instead of plurals
- Never use generic "item" terminology
- Use descriptive function names without "handle" prefix
- Use `navigateTo` prefix for navigation functions
- Use `show/hide` for modals (not open/close)

---

## State Management

- Use Legend State observables
- Export actions object with CRUD operations
- Provide typed selector hooks
- Manual IndexedDB persistence after mutations
- Include `isInitialized` field for loading states

---

## Form Handling

- React Hook Form with Zod resolver
- Separate initialization and submission hooks
- Use Controller for all form fields
- Show validation errors inline
- Navigate to list after successful submission

---

## Component Structure

- Memo components for performance
- Extract field components for reusability
- Keep route components clean (just layout)
- Use FormProvider for nested Controller access
- Section components (Header, Content, Footer)

---

## Special Inputs

- **Phone**: `filterPhoneInput`
- **Integer**: `allowOnlyNumbers` + `sanitizeNumberInput`
- **Decimal**: `allowNumbersWithDecimal` + `sanitizeDecimalInput`
- **Currency**: `formatCurrency` + `parseCurrencyInput`
- **Date**: Use `DatePicker` component
- **Select**: Use shadcn/ui Select with store hooks

---

[← Checklist](./checklist.md) | [Back to Main](./README.md)
