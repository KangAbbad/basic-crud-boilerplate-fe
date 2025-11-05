# TypeScript Rules

1. Use `bun` instead of `npm` or `pnpm` or `yarn` for package manager

2. Prefer to use `type` over `interface` when declaring shapes. `type` is stricter and prevents accidental extension.

3. **Always avoid `unknown` and `any` types**. These types should be used ONLY in urgent situations where there is no other option. Prioritize defining explicit types using TypeScript's type system. When you encounter an unknown type:
   - **First Priority**: Define an explicit type using `type`, `interface`, or Zod schema
   - **Second Priority**: Use union types or discriminated unions to cover all possible cases
   - **Third Priority**: Use generic types with constraints (`<T extends SomeBase>`)
   - **Last Resort Only**: Use `unknown` (preferred over `any`) when absolutely necessary, and immediately narrow the type with explicit checks
   
   ```typescript
   // ❌ AVOID - Using any/unknown as default
   const processData = (data: any) => { ... }
   const result: unknown = fetchData()
   
   // ✅ CORRECT - Define explicit types
   type UserData = {
     id: string
     name: string
     email: string
   }
   const processData = (data: UserData) => { ... }
   const result: UserData = fetchData()
   
   // ✅ CORRECT - Use Zod schema for validation
   const UserDataSchema = z.object({
     id: z.string(),
     name: z.string(),
     email: z.string(),
   })
   type UserData = z.infer<typeof UserDataSchema>
   const processData = (data: UserData) => { ... }
   
   // ✅ CORRECT - Use union types for multiple possibilities
   type ApiResponse = SuccessResponse | ErrorResponse
   const getResponse = (response: ApiResponse) => { ... }
   
   // ✅ CORRECT - Use generics with constraints
   const processEntity = <T extends { id: string }>(entity: T) => { ... }
   
   // ⚠️ LAST RESORT - Only when interfacing with untyped third-party libraries
   const getLegacyLibrary = (input: unknown) => {
     // Immediately narrow with type guards
     if (typeof input === 'string') {
       return input.toUpperCase()
     }
     if (isValidUser(input)) {
       return processUser(input)
     }
     throw new Error('Invalid input type')
   }
   ```
   
   **Rationale**: Using `any` or `unknown` disables TypeScript's type safety, leading to runtime errors and reduced code maintainability. Explicit types provide better IntelliSense, catch errors at compile time, and make code self-documenting.

4. Use descriptive function names without the `handle` prefix. For event handlers, name them based on the action they perform:
  ```typescript
  // Avoid ❌
  const handleShowDeleteModal = () => { ... }
  const handleSubmitForm = () => { ... }

  // Better ✅ 
  const showDeleteModal = () => { ... }
  const submitForm = () => { ... }
  ```

5. Avoid using the 'on' prefix for function names unless they are component props. The 'on' prefix should only be used for functions passed as props to components (event handlers). All other functions should follow standard naming conventions without the 'on' prefix. Apply this constraint to filenames as well—do not create files whose names begin with `on` unless the file exports a prop handler component:
  ```typescript
  // Component props - 'on' prefix allowed ✅
  <Button onPress={buttonPress} />
  <TextInput onChangeText={changeText} />

  // Internal functions - avoid 'on' prefix ❌
  const onSubmitForm = () => { ... }
  const onValidateInput = () => { ... }
  const onFetchData = () => { ... }

  // Internal functions - use standard naming ✅
  const submitForm = () => { ... }
  const validateInput = () => { ... }
  const fetchData = () => { ... }
  ```

6. For navigation functions, use the `navigateTo` prefix instead of `goTo`. This requirement extends to filenames; navigation-related files must use `navigateTo` in the filename when the action is represented there (e.g., `navigateToDashboard.ts`). For example:
  ```typescript
  // Avoid ❌
  const goToHomePage = () => { ... }
  const goToProfilePage = () => { ... }

  // Better ✅
  const navigateToHomePage = () => { ... }
  const navigateToProfilePage = () => { ... }
  ```

7. For show/hide modal functions, use the `show/hide` prefix instead of `open/close`. Filenames implementing these behaviours must mirror this naming (e.g., `showDeleteModal.ts`, `hideDeleteModal.ts`). For example:
  ```typescript
  // Avoid ❌
  const openDeleteModal = () => { ... }
  const closeDeleteModal = () => { ... }
  
  // Better ✅
  const showDeleteModal = () => { ... }
  const hideDeleteModal = () => { ... }
  ```

8. The generic term "item," regardless of casing, is prohibited throughout the codebase, with the sole exception of when its use is required for compatibility with a third-party library's API. This prohibition applies comprehensively to all internal code artifacts, including variables, functions, components, and types. **For API data types, use the "DTO" (Data Transfer Object) suffix** to clearly indicate data that is transferred between the frontend and backend.
  ```typescript  
  // Component names ❌
  export function DeleteItemModal() { ... }        // Use: DeleteModal or Delete[Entity]Modal
  export function ItemCard() { ... }               // Use: [Entity]Card
  export function SelectItemDialog() { ... }       // Use: Select[Entity]Dialog
  
  // Function names ❌  
  const deleteItem = () => { ... }                 // Use: deleteProduct, deleteUser, etc.
  const selectItem = (item) => { ... }             // Use: selectProduct(product)
  const updateItem = () => { ... }                 // Use: updateWarehouse, updateLocation, etc.
  const getSelectedItems = () => { ... }           // Use: getSelectedProductList
  const handleItemClick = () => { ... }            // Use: handleProductClick
  
  // Variable names ❌
  const item = productList[0]                      // Use: product, user, warehouse, etc.
  const selectedItem = findById(id)                // Use: selectedProduct, selectedUser
  const itemList = await fetchData()               // Use: productList, userList 
  const currentItem = state.current                // Use: currentProduct, currentOrder
  const itemCount = list.length                    // Use: productCount, userCount
  
  // Type/Interface names ❌
  type ItemType = { ... }                          // Use: ProductDTO, UserDTO
  type ItemRecord = { ... }                        // Use: ProductDTO, UserDTO
  interface ItemProps { ... }                      // Use: ProductProps or specific Props
  type SelectedItem = Product | User               // Use: SelectedEntity or be specific
  interface ItemListResponse { ... }               // Use: ProductListResponseDTO
  
  // Props ❌
  <Component item={data} />                        // Use: product={product}, user={user}
  <Modal onSelectItem={handler} />                 // Use: onSelectProduct={handler}
  <List renderItem={renderer} />                   // Use: renderProduct, renderRow
  
  // Parameters ❌
  function processItem(item: any) { ... }          // Use: processProduct(product: Product)
  const mapItems = (items) => items.map(...)       // Use: mapProducts = (products) =>
  
  // Comments ❌
  // This function deletes an item                 // Use: "deletes the product"
  // Loop through items                            // Use: "Loop through products"
  
  // ✅ CORRECT PATTERNS - Always use specific entity names
  
  // Component names
  export function DeleteProductModal() { ... }      // Specific entity
  export function DeleteConfirmationModal() { ... } // Generic without "item"
  export function ProductCard() { ... }             // Entity-specific
  
  // Function names
  const deleteProduct = () => { ... }              // Clear entity
  const selectWarehouse = (warehouse) => { ... }   // Entity as parameter
  const updateUserProfile = () => { ... }          // Specific action
  
  // Variable names  
  const product = productList[0]                   // Entity-specific
  const selectedWarehouse = findById(id)           // Clear what's selected
  const userList = await fetchUserList()           // Entity with List suffix
  
  // Type names - Use DTO suffix for API data
  const ProductDTOSchema = z.object({})
  type ProductDTO = { ... }                        // API data transfer object
  const UserDTOSchema = z.object({})
  type UserDTO = { ... }                           // API data transfer object
  const CreateProductDTOSchema = z.object({})
  type CreateProductDTO = { ... }                  // Request DTO
  const UpdateProductDTOSchema = z.object({})
  type UpdateProductDTO = { ... }                  // Request DTO
  const ProductListResponseDTOSchema = z.object({})
  type ProductListResponseDTO = { ... }            // Response DTO
  ```  
  **Rationale**:
  - **Clarity**: "Item" is vague and provides no context about what entity is being handled
  - **Searchability**: Entity-specific names make code searches more precise
  - **Type Safety**: TypeScript can better enforce type checking with specific entity names
  - **Maintainability**: Developers immediately understand what data they're working with
  - **Domain Modeling**: Code should reflect business domain terms (Product, User, Order) not generic programming terms

9. Use "List" suffix instead of plural forms (s/es) for collection naming. Apply this rule consistently across ALL naming conventions including variables, hooks, components, functions, types, filenames, and any other identifiers. **Important Exception**: Query key constants with `*_MASTER` or `*MASTER` suffix must remain unchanged (e.g., `RES_CUSTOMER_MASTER`, `RES_WAREHOUSE_MASTER`, `USER_MASTER`). All other identifiers including types, functions, and variables should follow the List suffix convention:
  ```typescript
  // Variables - avoid plural forms ❌
  const categories = await fetchCategories()
  const users = data.users
  const products = getProducts()
  const warehouses = state.warehouses

  // Variables - use "List" suffix ✅
  const categoryList = await fetchCategoryList()
  const userList = data.userList
  const productList = getProductList()
  const warehouseList = state.warehouseList

  // Hook names - avoid plural forms ❌
  const useProducts = () => { ... }
  const useCategories = () => { ... }
  const { data: users } = useUsers()

  // Hook names - use "List" suffix ✅
  const useProductList = () => { ... }
  const useCategoryList = () => { ... }
  const { data: userList } = useUserList()

  // Component names - avoid plural forms ❌
  function Products() { ... }
  function Categories() { ... }
  export function Users() { ... }

  // Component names - use "List" suffix ✅
  function ProductList() { ... }
  function CategoryList() { ... }
  export function UserList() { ... }

  // Function names - avoid plural forms ❌
  const fetchUsers = async () => { ... }
  const getProducts = () => { ... }
  const filterCategories = (items) => { ... }

  // Function names - use "List" suffix ✅
  const fetchUserList = async () => { ... }
  const getProductList = () => { ... }
  const filterCategoryList = (items) => { ... }

  // Query key constants with MASTER — EXCEPTION: keep unchanged ✅
  const RES_CUSTOMER_MASTER = 'RES_CUSTOMER_MASTER'  // Keep MASTER suffix (query key)
  const RES_WAREHOUSE_MASTER = 'RES_WAREHOUSE_MASTER'  // Keep MASTER suffix (query key)
  const USER_MASTER = 'USER_MASTER'  // Keep MASTER suffix (constant)
  
  // Types and functions — apply List suffix ✅
  type CustomerMasterDTO = z.infer<typeof CustomerMasterDTOSchema>  // Use DTO suffix
  type WarehouseMasterDTO = z.infer<typeof WarehouseMasterDTOSchema>  // Use DTO suffix
  export const getCustomerMaster = async () => { ... }  // Function names OK

  // Type definitions - avoid plural forms ❌
  type Users = User[]
  type Products = Product[]
  interface CategoriesResponse {
    categories: Category[]
  }

  // Type definitions - use "List" suffix ✅
  type UserList = User[]
  type ProductList = Product[]
  interface CategoryListResponse {
    categoryList: Category[]
  }

  // Real-world examples ✅
  const userList = await fetchUserList()
  const filteredProductList = productList.filter(p => p.isActive)
  const selectedUserList = userList.slice(0, 10)

  // Map/iterate with clear naming ✅
  userList.map(user => <UserCard key={user.id} user={user} />)
  categoryList.forEach(category => console.log(category.name))

  // State management ✅
  const [productList, setProductList] = useState<Product[]>([])
  const [categoryList, setCategoryList] = useState<Category[]>([])

  // Props ✅
  type Props = {
    userList: User[]
    categoryList: Category[]
    onSelectProduct: (product: Product) => void  // singular for single item
  }
  ```
  **Rationale**: 
  - **Clarity**: "List" suffix makes it immediately clear that the variable contains a collection/array, not a single item
  - **Consistency**: Using "List" suffix universally prevents confusion between singular and plural forms (e.g., "data" vs "datas", "series" vs "series")
  - **Searchability**: Easy to search for all list/collection variables using "List" keyword
  - **TypeScript Safety**: Clearer distinction between `user: User` and `userList: User[]`
  - **Irregular Plurals**: Eliminates confusion with irregular plurals (e.g., "person/people", "child/children", "datum/data")
  - **Avoids Ambiguity**: Some words don't change in plural form (e.g., "sheep", "fish", "data"), making "List" suffix necessary for clarity

10. Use context-specific function names that clearly describe both the ACTION and the DOMAIN/CONTEXT. Function names must explicitly indicate what is being acted upon and in what context, avoiding generic action words that could apply to multiple scenarios. Ensure filenames are equally explicit (e.g., `cancelOrderCreation.ts` instead of `cancelAction.ts`):
  ```typescript
  // ❌ AVOID - Too generic, lacks context
  const refresh = () => { ... }              // What is being refreshed?
  const submit = () => { ... }               // Submit what?
  const cancel = () => { ... }               // Cancel what operation?
  const confirmDelete = () => { ... }        // Delete what entity?
  const updateContent = () => { ... }        // What content? Where?
  const cancelAction = () => { ... }         // What action specifically?
  const refreshOnUnload = () => { ... }      // Still too vague

  // ❌ AVOID - Still not specific enough
  const cancelModal = () => { ... }          // Which modal? What operation?
  const submitForm = () => { ... }           // Which form? What purpose?
  const deleteItem = () => { ... }           // What type of item?

  // ✅ CORRECT - Context + Action clearly defined
  const cancelOrderCreation = () => { ... }         // Clear: canceling order creation process
  const submitUserRegistration = () => { ... }      // Clear: submitting user registration form
  const confirmProductDeletion = () => { ... }      // Clear: confirming product deletion
  const refreshAuthTokenOnUnload = () => { ... }    // Clear: refreshing auth token on page unload
  const updateEditorContent = () => { ... }         // Clear: updating editor's content
  const dismissNetworkErrorModal = () => { ... }    // Clear: dismissing network error modal
  const cancelWarehouseCreation = () => { ... }     // Clear: canceling warehouse creation

  // 🚫 STRICT PROHIBITION: Never end function names with the suffix "Action"
  // This suffix violates clarity requirements because it hides the actual intent.
  // Rename any existing functions that end with "Action" to describe the specific behaviour.
  // ❌ Avoid
  const deleteWarehouseAction = () => { ... }
  const submitLocationFormAction = () => { ... }

  // ✅ Use explicit names instead
  const deleteWarehouse = () => { ... }
  const submitLocationForm = () => { ... }

  // 🚫 STRICT PROHIBITION: Never end function names with the suffix "Request"
  // This suffix signals a transport concern instead of the domain behaviour.
  // Always rename functions to reflect the actual domain intent instead of the request mechanism.
  // ❌ Avoid
  const deleteWarehouseRequest = () => { ... }
  const submitLocationFormRequest = () => { ... }

  // ✅ Use explicit names instead
  const submitWarehouseDeletion = () => { ... }
  const submitLocationForm = () => { ... }

  // ✅ Modal/Dialog operations with context
  const showDeleteUserModal = () => { ... }         // Not just "showModal"
  const hideProductEditDialog = () => { ... }       // Not just "hideDialog"
  const confirmOrderCancellation = () => { ... }    // Not just "confirm"
  const dismissSessionExpiredWarning = () => { ... } // Not just "dismiss"

  // ✅ Form operations with context
  const submitProductCreationForm = () => { ... }   // Not just "submitForm"
  const validateShippingAddress = () => { ... }     // Not just "validate"
  const resetPasswordChangeForm = () => { ... }     // Not just "resetForm"

  // ✅ Data operations with context
  const fetchUserOrderHistory = () => { ... }       // Not just "fetchData"
  const updateInventoryQuantity = () => { ... }     // Not just "updateData"
  const deleteExpiredSessions = () => { ... }       // Not just "deleteData"

  // ✅ Navigation with context
  const navigateToOrderDetails = () => { ... }      // Not just "navigate"
  const redirectToLoginAfterTimeout = () => { ... } // Not just "redirect"
  ```
  **Naming Pattern**: `[action][Entity/Domain][Context?]`
  - **Action**: What is being done (submit, cancel, update, delete, etc.)
  - **Entity/Domain**: What is being acted upon (User, Order, Product, etc.)
  - **Context** (optional): Additional context if needed (OnUnload, AfterTimeout, etc.)
  **Rationale**: 
  - **Self-Documenting**: Function purpose is immediately clear without reading implementation
  - **Avoid Conflicts**: Specific names prevent conflicts with native methods
  - **Searchability**: Finding all operations for a specific entity becomes trivial
  - **Maintainability**: Clear context reduces bugs from misunderstanding function purpose
  - **Code Review**: Reviewers instantly understand what each function does
  - **Refactoring Safety**: Specific names make it safe to refactor without confusion
  - **Domain Clarity**: Clearly indicates which business domain the function belongs to

11. Always use descriptive aliases when destructuring from reusable hooks with generic property names. Generic names like `isLoading`, `create`, `update`, `delete`, `show`, `hide` provide no context about which entity or operation they refer to. Aliasing makes the code self-documenting and prevents naming conflicts when using multiple hooks in the same component:
  ```typescript
  // ❌ AVOID - Generic names lack context
  const { isLoading, create, update, delete: deleteEntity } = useCustomerForm()
  const { show, hide } = useCustomerForm()
  const { isVisible } = useCustomerForm()
  
  // What if you need multiple entity hooks in the same component?
  const { isLoading, create, update } = useCustomerForm()  // Which loading? Create what?
  const { isLoading, create, update } = useProductForm()   // ❌ ERROR: Duplicate identifiers!

  // ✅ CORRECT - Always alias to specific, contextual names
  const { 
    isLoading: isCustomerFormLoading, 
    create: createCustomer, 
    update: updateCustomer, 
    delete: deleteCustomer 
  } = useCustomerForm()

  const { 
    isVisible: isCustomerModalVisible, 
    show: showCustomerModal, 
    hide: hideCustomerModal 
  } = useCustomerForm()

  // ✅ Multiple hooks in same component - no conflicts
  const { 
    isLoading: isCustomerLoading, 
    create: createCustomer, 
    update: updateCustomer, 
    delete: deleteCustomer 
  } = useCustomerForm()

  const { 
    isLoading: isProductLoading, 
    create: createProduct, 
    update: updateProduct, 
    delete: deleteProduct 
  } = useProductForm()

  // ✅ Now usage is crystal clear
  if (isCustomerLoading) { ... }           // Clear: customer operation is loading
  createCustomer(customerData)              // Clear: creating a customer
  updateProduct(productData)                // Clear: updating a product
  
  // ❌ vs generic names - unclear
  if (isLoading) { ... }                   // Which operation?
  create(data)                              // Create what?
  update(data)                              // Update which entity?

  // ✅ CORRECT - Full examples in components
  function CustomerManagementPage() {
    const { 
      isLoading: isCustomerFormLoading,
      isVisible: isCustomerModalVisible,
      create: createCustomer,
      update: updateCustomer,
      delete: deleteCustomer,
      show: showCustomerModal,
      hide: hideCustomerModal
    } = useCustomerForm()

    const {
      isLoading: isWarehouseFormLoading,
      create: createWarehouse,
      update: updateWarehouse
    } = useWarehouseForm()

    // Now every operation is explicit and clear
    const createCustomer = () => {
      if (isCustomerFormLoading) return
      createCustomer(data)
    }

    const createWarehouse = () => {
      if (isWarehouseFormLoading) return
      createWarehouse(warehouseData)
    }

    return (
      <Modal visible={isCustomerModalVisible} onClose={hideCustomerModal}>
        {/* ... */}
      </Modal>
    )
  }

  // ✅ Aliasing pattern for entity-specific hooks
  const {
    isLoading: is{Entity}FormLoading,        // Pattern: is{Entity}FormLoading
    isVisible: is{Entity}ModalVisible,       // Pattern: is{Entity}ModalVisible
    create: create{Entity},                  // Pattern: create{Entity}
    update: update{Entity},                  // Pattern: update{Entity}
    delete: delete{Entity},                  // Pattern: delete{Entity}
    show: show{Entity}Modal,                 // Pattern: show{Entity}Modal
    hide: hide{Entity}Modal,                 // Pattern: hide{Entity}Modal
  } = use{Entity}Form()
  ```
  **Rationale**:
  - **Clarity**: Aliases make it immediately obvious which entity/operation is being referenced
  - **No Conflicts**: Prevents naming collisions when using multiple hooks in the same component
  - **Self-Documenting**: Code reads naturally without needing to trace back to hook declarations
  - **Maintainability**: Easier to refactor and understand code months later
  - **Consistency**: Establishes a predictable naming pattern across the codebase
  - **Type Safety**: TypeScript can provide better intellisense with specific names
  - **Searchability**: Finding all customer operations becomes trivial (search "createCustomer")
  
  **When to Alias**:
  - ✅ **Always** alias when destructuring from reusable entity hooks (`useCustomerForm`, `useProductForm`, etc.)
  - ✅ **Always** alias generic property names (`isLoading`, `create`, `update`, `delete`, `show`, `hide`, `isVisible`)
  - ✅ Even when using a single hook, alias for consistency and clarity
  - ❌ Exception: Highly specific hooks with unique property names may not need aliasing (e.g., `useCustomerDetailData` returning `customerDetail`)

12. **NEVER use `suppressHydrationWarning` attribute in React components**. This attribute masks hydration mismatches between server-rendered and client-rendered content, hiding critical bugs that can cause inconsistent UI state, accessibility issues, and broken interactivity. Instead, identify and fix the root cause of hydration mismatches:
  ```typescript
  // ❌ FORBIDDEN - Never suppress hydration warnings
  <html suppressHydrationWarning>
    {children}
  </html>

  <body suppressHydrationWarning>
    {children}
  </body>

  <div suppressHydrationWarning>
    {content}
  </div>
  ```
  **Rationale**:
  - **Bugs in Production**: Suppressing warnings hides real issues that cause broken UI in production
  - **Accessibility**: Hydration mismatches can break screen readers and keyboard navigation
  - **Performance**: React has to do extra work to fix mismatches, degrading performance
  - **Maintainability**: Masked issues compound over time, making debugging harder
  - **Best Practice**: React team explicitly warns against using this except in rare edge cases
  - **User Experience**: Hydration errors can cause flickering, lost state, and broken interactions
  
  **Instead**: Always investigate and fix hydration warnings by:
  1. Using `useEffect` to defer client-only code to after hydration
  2. Ensuring server and client render the same initial content
  3. Using dynamic imports with `ssr: false` for client-only components
  4. Making timestamps/dates consistent between server and client
  5. Checking for browser extensions or third-party scripts interfering with DOM

13. **NEVER use namespace imports for React**. Always import React members directly instead of using namespace imports (`import * as React`). This improves tree-shaking, reduces bundle size, and makes dependencies explicit:
  ```typescript
  // ❌ FORBIDDEN - Namespace import
  import * as React from 'react'
  
  const MyComponent = () => {
    const [state, setState] = React.useState(0)
    const ref = React.useRef(null)
    React.useEffect(() => { ... }, [])
    
    return <div>{state}</div>
  }
  
  // ✅ CORRECT - Direct named imports
  import { useState, useRef, useEffect } from 'react'
  
  const MyComponent = () => {
    const [state, setState] = useState(0)
    const ref = useRef(null)
    useEffect(() => { ... }, [])
    
    return <div>{state}</div>
  }
  
  // ✅ CORRECT - Import only what you need
  import { useMemo, useCallback } from 'react'
  import type { ReactNode } from 'react'
  
  type Props = {
    children: ReactNode
  }
  
  const MyComponent = ({ children }: Props) => {
    const memoizedValue = useMemo(() => computeExpensiveValue(), [])
    const handleClick = useCallback(() => { ... }, [])
    
    return <div onClick={handleClick}>{children}</div>
  }
  ```
  **Rationale**:
  - **Tree-Shaking**: Bundlers can better eliminate unused code with direct imports
  - **Bundle Size**: Reduces final bundle size by importing only what's used
  - **Explicit Dependencies**: Makes it clear which React features are being used
  - **Readability**: Code is cleaner without the `React.` prefix everywhere
  - **Modern Standard**: Aligns with current React and TypeScript best practices
  - **Performance**: Faster compilation and smaller runtime footprint