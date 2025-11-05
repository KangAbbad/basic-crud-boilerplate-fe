# React Component Rules

## 1. JSX Property Ordering Rules

Follow this exact order when writing JSX component properties:

```tsx
<SomeComponent
  {...requiredProps}
  icon={<IconComponent />}
  customComponent={<CustomComponent />}
  className="tailwind-classes-here"
  style={styleObject}
  {...eventHandlers}
/>
```

### Property Order Breakdown:

**1.1. Required Props First**
- Place all required props (like `placeholder`, `value`, `disabled`, etc.) at the top
- These are props that the component needs to function properly

**1.2. Component Props**
- Add any `icon` or custom component props after required props
- These include JSX elements passed as props

**1.3. Styling Props**
- `className` comes before `style`
- Follow the className ordering pattern (see section 1.3.1)

**1.4. Event Handlers Last**
- All event handlers (`onPress`, `onValueChange`, `onChange`, etc.) go at the bottom
- This includes any function props that handle user interactions

## 2. Self-Contained Component Logic

Components should manage their own business logic through custom hooks rather than receiving handler functions as props. Only pass display data as props.

**Core Principle**: If the parent is just forwarding a handler from its own hook, the child should own that handler through its own hook instead.

```typescript
// ❌ AVOID - Parent forwards handler from parent's hook
const { saveData } = useMyLogic()
<MyComponent onSave={saveData} />

// ✅ CORRECT - Component owns its handler logic
<MyComponent />

export function MyComponent() {
  const { saveData } = useMyLogic()
  // ...
}
```

### 2.1. When to Use Props vs Hooks

- **Pass as Props**: Read-only display data (`details of data`, `isLoading`)
- **Use Hooks**: Business logic and handlers (`onSave`, `onDelete`, `updateFilter`)
- **Exception**: Generic UI components (`Button`, `Input`) receive handlers because they're context-agnostic

### 2.2. Benefits

- **Reduced Prop Drilling**: No forwarding handlers down multiple component levels
- **Reusable Components**: Components work standalone without prop coordination
- **Easier Testing**: Mock the hook instead of managing prop chains
- **Clear Ownership**: Each component owns its domain logic

### 2.3. When to Use Prop Drilling (Exceptions)

**Decision**: Is the parent just forwarding a handler from its own hook?
- YES → Component should own it (move to hook)
- NO → Pass as prop (parent has legitimate reason)

**Props ARE correct for:**
- Display data only: `<List details={details} />`
- Generic UI components: `<Button onClick={handler} />`

**Never pass handlers that:**
- Come from the component's own business domain
- Are derived from store/state actions
- Define the component's core behavior

### 2.4. Creating Self-Contained Hooks

Custom hooks should:
- **Encapsulate all related logic**: State, effects, handlers together
- **Use specific naming**: `useFormFilters`, `useUserActions` (not generic like `useLogic`)
- **Return organized data**: Group related values logically

```typescript
// ✅ GOOD - Hook encapsulates all logic for component
export function useMyComponentLogic() {
  const [state, setState] = useState(initialState)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Setup or data fetching
  }, [])

  const saveData = (data: Data) => {
    setIsLoading(true)
    // Save logic
  }

  const deleteData = (id: string) => {
    // Delete logic
  }

  return {
    // Organized by concern: state, actions
    state,
    isLoading,
    saveData,
    deleteData,
  }
}

// Component uses it
export function MyComponent() {
  const { state, isLoading, saveData, deleteData } = useMyComponentLogic()
  // Component only renders, doesn't manage logic
}
```