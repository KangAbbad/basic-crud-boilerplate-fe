# TailwindCSS Rules

- Always use `clsx` for conditional classname in React component / HTML elements
- Prefer to use `space-y-*` instead of `gap-*` for spacing between elements

## Text Color Rule

- Do not use `text-gray-900` for valuable/primary information (titles, important data, main content). Let it default to black for maximum contrast and emphasis.

Example:
```tsx
{/* ❌ Wrong: Primary data with text-gray-900 */}
<p className="text-gray-900 font-bold">Important price</p>

{/* ✅ Correct: Primary data without color class (black by default) */}
<p className="font-bold">Rp 50.000</p>
```