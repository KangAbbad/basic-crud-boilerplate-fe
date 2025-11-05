# API Contract Standardization Guide

This document defines the standardized patterns for API contracts (create, update, delete) in the project.

---

## Table of Contents

1. [Overview](#overview)
2. [🚨 Critical: Frontend vs Backend Boundaries](#-critical-frontend-vs-backend-boundaries)
3. [Service Layer Pattern](#service-layer-pattern)
4. [Operation-Specific Patterns](#operation-specific-patterns)
5. [Complete Example](#complete-example)
6. [Naming Conventions](#naming-conventions)
7. [Best Practices](#best-practices)
8. [Common Pitfalls](#common-pitfalls)

---

## Overview

API contracts follow a two-layer architecture:

1. **Service Layer** (`/services/{operation}.ts`) - Handles API communication and validation
   - `post.ts` for create operations
   - `put.ts` or `patch.ts` for update operations (depends on API implementation)
   - `delete.ts` for delete operations
2. **Hook Layer** (`/hooks/api/use{Operation}{Entity}.tsx`) - Manages mutations, cache invalidation, and user feedback
   - `useCreate{Entity}.tsx` for create operations
   - `useUpdate{Entity}.tsx` for update operations
   - `useDelete{Entity}.tsx` for delete operations
   - **Any custom-named hooks** that use POST/PUT/PATCH/DELETE operations (e.g., `useGenerateProductionSummary.tsx`)

**Important**: This guide applies to **ALL hooks that perform mutations** (POST/PUT/PATCH/DELETE), not just those following the `useCreate*/useUpdate*/useDelete*` naming pattern. If a hook uses `useMutation` or `useApiMutation` and calls a service function with POST/PUT/PATCH/DELETE, it should follow these standards.

---

## 🚨 Critical: Frontend vs Backend Boundaries

**This document defines frontend code standards, NOT backend API design.**

### What You CANNOT Change (Backend Contract)

These must EXACTLY match the backend API. Changing these requires backend coordination:

1. **Schema Field Names**: If backend returns `customer_id`, your Zod schema MUST use `customer_id`
2. **Endpoint URLs**: Must match actual backend routes
3. **HTTP Methods**: Must use what backend expects (POST/PUT/PATCH/DELETE)
4. **Request/Response Structure**: Must match backend's actual data format
5. **Query Parameter Names**: Must match what backend expects

```typescript
// ❌ WRONG - Renaming backend fields breaks API contract
export const CustomerDataDTOSchema = z.object({
  customerID: z.string(),  // ❌ Backend sends "customer_id", not "customerID"
})

// ✅ CORRECT - Match backend field names exactly
export const CustomerDataDTOSchema = z.object({
  customer_id: z.string(),  // ✅ Matches backend response
})

// ✅ Then alias when consuming in components
const { customer_id: customerID } = data?.data ?? {}
```

### What You CAN Change (Frontend Code)

These are pure frontend concerns and can be changed freely:

1. **Schema/Type Names**: `ItemDTO` → `ProductDTO` (frontend naming)
2. **Service Function Names**: `deleteItem()` → `deleteProduct()` (frontend code)
3. **Hook Names**: `useItemDetail` → `useProductDetail` (frontend hooks)
4. **Component Names**: `ItemCard` → `ProductCard` (frontend UI)
5. **Local Variable Names**: `const item` → `const product` (frontend variables)
6. **Internal Transformations**: Convert backend snake_case to camelCase for internal use

```typescript
// ✅ CORRECT - Frontend naming improvements (doesn't affect API)
export const ProductDeleteDataDTOSchema = z.object({
  customer_id: z.string(),  // Keep backend field name
})
export type ProductDeleteDataDTO = z.infer<typeof ProductDeleteDataDTOSchema>

export const deleteProduct = async (params: ProductDeleteParamsDTO) => {
  // Function name improved, but API contract unchanged
  const res = await apiCall(`${endpoint}/${params.id}`, ProductDeleteResponseDTOSchema, {
    method: 'DELETE',
  })
  return res
}
```

### When Backend Has Poor Naming

If the backend uses poor naming (e.g., generic "item" fields, snake_case), you have two approaches:

#### **Option 1: Destructuring with Aliasing (Recommended - 90% of cases)**

**Principle**: Accept backend field names in schema, alias when consuming.

```typescript
// Step 1: Schema matches backend exactly
export const ProductDataDTOSchema = z.object({
  item_id: z.string(),      // Backend field name (keep as-is)
  item_code: z.string(),    // Backend field name (keep as-is)
  item_name: z.string(),    // Backend field name (keep as-is)
  item_price: z.number(),   // Backend field name (keep as-is)
})

export type ProductDataDTO = z.infer<typeof ProductDataDTOSchema>
// Type: { item_id: string, item_code: string, ... }

// Step 2: Service returns backend data unchanged
export const getProduct = async (id: string) => {
  const res = await apiCall(`/products/${id}`, ProductResponseDTOSchema, {
    method: 'GET',
  })
  return res
}

// Step 3: Alias when consuming in components
function ProductDetail({ id }: Props) {
  const { data } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProduct(id),
  })

  // ✅ Destructure with aliasing - simple and clean!
  const {
    item_id: productID,
    item_code: productCode,
    item_name: productName,
    item_price: productPrice,
  } = data?.data ?? {}

  return (
    <div>
      <h1>{productName}</h1>         {/* ✅ Clean naming */}
      <p>Code: {productCode}</p>     {/* ✅ No "item" terminology */}
      <p>Price: ${productPrice}</p>
    </div>
  )
}

// ✅ Works great in loops too
function ProductList() {
  const { data } = useQuery({
    queryKey: ['products'],
    queryFn: getProductList,
  })

  return (
    <table>
      <tbody>
        {data?.data?.items?.map((product) => {
          // Alias inside map
          const {
            item_id: productID,
            item_name: productName,
            item_price: productPrice,
          } = product

          return (
            <tr key={productID}>
              <td>{productName}</td>
              <td>${productPrice}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
```

**✅ Advantages:**
- **Simple**: No double work - define schema once, alias when needed
- **Flexible**: Each component can choose what to alias
- **Less Code**: No transform function to write and maintain
- **Familiar**: Standard JavaScript destructuring pattern
- **Type Safe**: Still get full TypeScript checking

#### **Option 2: Direct Access (Quick & Dirty)**

```typescript
export const ProductDataDTOSchema = z.object({
  item_id: z.string(),
  item_name: z.string(),
})
export type ProductDataDTO = z.infer<typeof ProductDataDTOSchema>

// Just use backend field names directly
const product: ProductDataDTO = fetchedData
const productID = product.item_id  // ⚠️ Mixed naming (not ideal)
```

**⚠️ Use only for:**
- Quick prototypes
- Temporary code
- Single usage points

### Recommended Approach

**Always prefer destructuring with aliasing (Option 1)** for handling backend field names. It's:
- ✅ **Simple** - No complex transformation logic
- ✅ **Flexible** - Each component chooses what to alias
- ✅ **Maintainable** - Easy to understand and modify
- ✅ **Performant** - No runtime overhead

**Why not use other approaches?**
- ❌ Zod `.transform()` - Adds complexity, double work, and runtime overhead
- ❌ Global transformations - Reduces flexibility, harder to maintain
- ❌ Computed fields in schemas - Mixing concerns (data structure vs. business logic)
```

### Key Principle

> **The frontend must accept what the backend sends, but can improve how it uses that data internally.**

**Before making changes:**
1. ✅ Schema/type/function NAMES? Change freely (frontend only)
2. ⚠️ Schema FIELD names? Check if backend sends them first
3. ⚠️ Endpoint URLs or HTTP methods? Coordinate with backend
4. ✅ Variable names and transformations? Change freely (frontend only)

---

## Service Layer Pattern

### File Locations
```
/services/post.ts    # For create operations
/services/put.ts     # For update operations (full replacement)
/services/patch.ts   # For update operations (partial update)
/services/delete.ts  # For delete operations
```

**Important Note on Update Operations:**
- Check the existing API implementation to determine which method to use
- The HTTP method in the service function should match: `PUT` for `put.ts`, `PATCH` for `patch.ts`

### Service Function Argument Pattern

**CRITICAL RULE**: Service functions should use different argument patterns based on the number of parameters:

| Number of Arguments | Pattern | Example |
|---------------------|---------|---------|
| **1 argument** | Direct parameter | `async (body: RequestBody)` |
| **1 argument** | Direct parameter | `async (params: Params)` |
| **2+ arguments** | Object destructuring | `async ({ params, body }: { params: Params; body: Body })` |

**Why this matters:**
- ✅ **Single argument**: Cleaner, more concise - `deleteEntity(params)` not `deleteEntity({ params })`
- ✅ **Multiple arguments**: Clear parameter naming - `updateEntity({ params, body })` not `updateEntity(params, body)`
- ✅ **Consistency**: Follows JavaScript/TypeScript best practices

**Examples:**

```typescript
// ❌ WRONG - Single argument with unnecessary wrapper
export const deleteEntity = async ({ params }: { params: DeleteParams }) => { ... }

// ✅ CORRECT - Single argument, direct parameter
export const deleteEntity = async (params: DeleteParams) => { ... }

// ❌ WRONG - Multiple arguments without object
export const updateEntity = async (params: UpdateParams, body: UpdateBody) => { ... }

// ✅ CORRECT - Multiple arguments with object destructuring
export const updateEntity = async ({ params, body }: { params: UpdateParams; body: UpdateBody }) => { ... }
```

### Required Structure

The structure is consistent across all mutation types with minor variations:

```typescript
// 1. PARAMS SCHEMA - URL query parameters
// Define based on your API requirements
export const {Operation}{Entity}ParamsDTOSchema = z.object({
  // Additional params as needed
})

export type {Operation}{Entity}ParamsDTO = z.infer<typeof {Operation}{Entity}ParamsDTOSchema>

// 2. REQUEST BODY SCHEMA - Data to be sent (for create/update only)
// Not needed for delete operations
export const {Operation}{Entity}RequestBodyDTOSchema = z.object({
  // Additional body as needed
})

export type {Operation}{Entity}RequestBodyDTO = z.infer<typeof {Operation}{Entity}RequestBodyDTOSchema>

// 3. RESPONSE DATA SCHEMA - Structure of the entity
export const {Operation}{Entity}DataDTOSchema = z.object({
  // Additional fields as needed
})

export type {Operation}{Entity}DataDTO = z.infer<typeof {Operation}{Entity}DataDTOSchema>

// 4. RESPONSE SCHEMA - Full HTTP response wrapper
export const {Operation}{Entity}ResponseDTOSchema = httpGetDetailResponseSchemaBuilder({Operation}{Entity}DataDTOSchema)

export type {Operation}{Entity}ResponseDTO = z.infer<typeof {Operation}{Entity}ResponseDTOSchema>

// 5. API FUNCTION - The actual service call
// 
// **IMPORTANT ARGUMENT PATTERN RULE**:
// - Use object destructuring ONLY when function has 2+ arguments
// - Use direct parameter when function has 1 argument
//
// Create/Update WITH params pattern (2 arguments - use object destructuring):
export const {operation}{Entity} = async ({
  params,
  body,
}: {
  params: {Operation}{Entity}ParamsDTO
  body: {Operation}{Entity}RequestBodyDTO
}) => {
  const res = await apiCall({domain}EndpointUrls.{entities}, {Operation}{Entity}ResponseDTOSchema, {
    method: 'POST', // or 'PUT'/'PATCH' for update (match your API)
    body: JSON.stringify(body),
    params,
  })
  return res
}

// Create/Update WITHOUT params pattern (1 argument - use direct parameter):
export const {operation}{Entity} = async (
  body: {Operation}{Entity}RequestBodyDTO  // Direct parameter, NOT { body }
) => {
  const res = await apiCall({domain}EndpointUrls.{entities}, {Operation}{Entity}ResponseDTOSchema, {
    method: 'POST', // or 'PUT'/'PATCH' for update (match your API)
    body: JSON.stringify(body),
  })
  return res
}

// Delete pattern (1 argument - use direct parameter):
export const delete{Entity} = async (params: Delete{Entity}ParamsDTO) => {
  const { {entity}_id, organization_id } = params
  const res = await apiCall(`${domain}EndpointUrls.{entities}/${entity}_id}`, Delete{Entity}ResponseDTOSchema, {
    method: 'DELETE',
    params: { organization_id },
  })
  return res
}
```

### Schema Naming Convention

| Schema Type | Pattern | Create Example | Update Example | Delete Example |
|------------|---------|----------------|----------------|----------------|
| Params | `{Operation}{Entity}ParamsDTOSchema` | `CreateCustomerParamsDTOSchema` | `UpdateCustomerParamsDTOSchema` | `DeleteCustomerParamsDTOSchema` |
| Request Body | `{Operation}{Entity}RequestBodyDTOSchema` | `CreateCustomerRequestBodyDTOSchema` | `UpdateCustomerRequestBodyDTOSchema` | N/A (not needed) |
| Response Data | `{Operation}{Entity}DataDTOSchema` | `CreateCustomerDataDTOSchema` | `UpdateCustomerDataDTOSchema` | `DeleteCustomerDataDTOSchema` |
| Response Wrapper | `{Operation}{Entity}ResponseDTOSchema` | `CreateCustomerResponseDTOSchema` | `UpdateCustomerResponseDTOSchema` | `DeleteCustomerResponseDTOSchema` |

---

#### No Params Required
```typescript
// When your API doesn't need query params, OMIT the params schema and params parameter entirely
// DON'T do this:
export const Create{Entity}ParamsDTOSchema = z.object({})  // ❌ Don't create empty schema

export const create{Entity} = async ({
  params,  // ❌ Don't include params parameter
  body,
}: {
  params: Create{Entity}ParamsDTO
  body: Create{Entity}RequestBodyDTO
})

// DO this instead:
// No params schema needed at all

export const create{Entity} = async (
  body: Create{Entity}RequestBodyDTO  // ✅ Only accept body parameter
) => {
  const res = await apiCall(url, schema, {
    method: 'POST',
    body: JSON.stringify(body),
    // No params field
  })
  return res
}
```

---

### Type Naming Convention

All types are inferred from schemas using the same name without "Schema":
```typescript
// Create operation
export type Create{Entity}ParamsDTO = z.infer<typeof Create{Entity}ParamsDTOSchema>
export type Create{Entity}RequestBodyDTO = z.infer<typeof Create{Entity}RequestBodyDTOSchema>
export type Create{Entity}DataDTO = z.infer<typeof Create{Entity}DataDTOSchema>

// Update operation
export type Update{Entity}ParamsDTO = z.infer<typeof Update{Entity}ParamsDTOSchema>
export type Update{Entity}RequestBodyDTO = z.infer<typeof Update{Entity}RequestBodyDTOSchema>
export type Update{Entity}DataDTO = z.infer<typeof Update{Entity}DataDTOSchema>

// Delete operation
export type Delete{Entity}ParamsDTO = z.infer<typeof Delete{Entity}ParamsDTOSchema>
export type Delete{Entity}DataDTO = z.infer<typeof Delete{Entity}DataDTOSchema>
```

---

## Naming Conventions

### File Names
- **Service files** (always lowercase):
  - Create: `post.ts`
  - Update: `put.ts` (for full replacement) or `patch.ts` (for partial update)
  - Delete: `delete.ts`
- **Hook files** (PascalCase for entity):
  - Create: `useCreate{Entity}.tsx`
  - Update: `useUpdate{Entity}.tsx`
  - Delete: `useDelete{Entity}.tsx`

### Function Names
- **Service functions**:
  - Create: `create{Entity}` (e.g., `createCustomer`)
  - Update: `update{Entity}` (e.g., `updateCustomer`)
  - Delete: `delete{Entity}` (e.g., `deleteCustomer`)
- **Hooks**:
  - Create: `useCreate{Entity}` (e.g., `useCreateCustomer`)
  - Update: `useUpdate{Entity}` (e.g., `useUpdateCustomer`)
  - Delete: `useDelete{Entity}` (e.g., `useDeleteCustomer`)

### Schema Export Pattern
Always export both schema and type:
```typescript
export const SomeSchemaDTO = z.object({ ... })
export type SomeTypeDTO = z.infer<typeof SomeSchemaDTO>
```

---

## Best Practices

### 1. **Export All Types**
Export all schemas and types for reuse in forms and components

### 2. **Single Responsibility**
- Service layer: API calls and validation
- Hook layer: Mutations, cache, and UI feedback

### 3. **Omit Unnecessary Parameters**
When your API doesn't require query parameters, omit the params schema, type, and parameter entirely:
```typescript
// DON'T add empty params
export const CreateEntityParamsDTOSchema = z.object({})  // ❌ Don't create empty schema

// DO omit params completely
export const createEntity = async (body: CreateEntityRequestBodyDTO) => { ... }  // ✅
```

### 4. **Use Correct Argument Pattern**
Follow the service function argument pattern rule:
```typescript
// ❌ WRONG - Unnecessary object wrapper for single argument
export const deleteEntity = async ({ params }: { params: DeleteEntityParamsDTO }) => { ... }
export const createEntity = async (body: CreateEntityRequestBodyDTO) => { ... }

// ✅ CORRECT - Direct parameter for single argument
export const deleteEntity = async (params: DeleteEntityParamsDTO) => { ... }
export const createEntity = async (body: CreateEntityRequestBodyDTO) => { ... }

// ✅ CORRECT - Object destructuring for multiple arguments
export const updateEntity = async ({ params, body }: { params: UpdateEntityParamsDTO; body: UpdateEntityRequestBodyDTO }) => { ... }
```

---

## Common Pitfalls

### ❌ Don't: Use inconsistent naming
```typescript
// Wrong - service function doesn't match entity name
export const createItem = async (...)
export const CreateCustomerBodySchema = z.object(...)  // Missing "RequestBody" in schema name
```

### ✅ Do: Follow naming conventions
```typescript
// Correct - service function includes entity name
export const createCustomer = async (...)
export const CreateCustomerRequestBodySchema = z.object(...)
```

---

### ❌ Don't: Change backend field names in schemas
```typescript
// Wrong - schema field names must match backend
export const CustomerDataDTOSchema = z.object({
  customerID: z.string(),     // ❌ Backend sends "customer_id"
  customerName: z.string(),   // ❌ Backend sends "customer_name"
})

// Wrong - this breaks API contract
const res = await apiCall(url, CustomerDataDTOSchema, { method: 'GET' })
// Will fail because backend sends { customer_id: "123", customer_name: "John" }
```

### ✅ Do: Match backend field names, improve frontend naming
```typescript
// Correct - match backend field names in schema
export const CustomerDataDTOSchema = z.object({
  customer_id: z.string(),    // ✅ Matches backend
  customer_name: z.string(),  // ✅ Matches backend
})

// Frontend type naming can be improved
export type CustomerDataDTO = z.infer<typeof CustomerDataDTOSchema>  // ✅ Good name

// Service function name can be improved
export const getCustomer = async (id: string) => {  // ✅ Descriptive name
  const res = await apiCall(url, CustomerDataDTOSchema, { method: 'GET' })
  return res
}
```

---

### ❌ Don't: Create empty params schema when not needed
```typescript
// Wrong - unnecessary empty schema
export const CreateCustomerParamsSchema = z.object({})

export const createCustomer = async ({
  params,
  body,
}: {
  params: CreateCustomerParamsDTO
  body: CreateCustomerRequestBodyDTO
})
```

### ✅ Do: Omit params entirely when not needed
```typescript
// Correct - no params schema, params parameter, or params type
export const createCustomer = async (
  body: CreateCustomerRequestBodyDTO
) => {
  const res = await apiCall(url, schema, {
    method: 'POST',
    body: JSON.stringify(body),
    // No params field in apiCall
  })
  return res
}
```

---

## 📝 Final Reminder for AI Assistants

**This guide provides PATTERNS, not RIGID RULES.**

Every entity is unique. Your job is to:
1. ✅ Understand the **specific entity's requirements**
2. ✅ Adapt the **pattern to fit those requirements**
3. ✅ Match the **existing codebase style**
4. ✅ **RESPECT backend API contracts** (see "Frontend vs Backend Boundaries" section)
5. ❌ NOT blindly copy-paste templates

**When implementing, ask yourself:**
- "Have I checked what fields this API actually uses?" ⚠️
- "Does my schema FIELD NAMES match the actual backend response?" ⚠️ **CRITICAL**
- "Am I only changing frontend naming (types/functions/variables)?" ✅ **SAFE**
- "Or am I changing API field names that backend sends?" ⚠️ **REQUIRES BACKEND CHANGE**
- "Have I looked at similar implementations in this codebase?"
- "Am I following the existing naming patterns?"
- "Does this operation need create, update, or delete behavior?"
- "For update operations: Does the API use PUT or PATCH?" ⚠️
- "Are the status codes and query invalidations appropriate for this operation?"
- "Is the service function argument pattern correct?" ⚠️
  - 1 argument → Direct parameter: `async (body: Body)` NOT `async ({ body }: ...)`
  - 2+ arguments → Object destructuring: `async ({ params, body }: ...)`

**Critical Distinction:**
- ✅ **Frontend Code**: Type names, function names, variable names, component names → **Change freely**
- ⚠️ **API Contract**: Schema field names, endpoints, HTTP methods → **Must match backend exactly**

If you can't answer these questions, **stop and gather more context first.**
