# E2E Testing with Playwright

## Setup

Playwright is already installed. To install browser binaries:

```bash
bunx playwright install
```

## Running Tests

```bash
# First time setup - install browsers
bunx playwright install

# Run all tests (headless)
bun run test:e2e

# Run specific test file
bun run test:e2e e2e/outlet-creation.spec.ts

# Run test by name (grep pattern)
bun run test:e2e --grep "should create a new outlet"

# Run tests with UI mode (interactive)
bun run test:e2e:ui

# Run tests in headed mode (watch browser)
bun run test:e2e:headed
```

## Test Structure

- `e2e/outlet-creation.spec.ts` - Tests for outlet creation flow

## Test Coverage

### Outlet Creation (`outlet-creation.spec.ts`)

1. **Create new outlet** - Full flow from form to list verification
2. **Validation errors** - Required field validation
3. **Cancel creation** - Form cancellation and navigation
4. **Edit existing outlet** - Update flow verification
5. **Province-City cascade** - Dropdown dependency validation
6. **Logo upload/remove** - Image upload and removal functionality
7. **Create with logo and location** - Full form with optional fields
8. **All fields presence** - Verify all form fields render correctly

## Important Notes

- Tests clear IndexedDB before each test for clean state
- Dev server starts automatically via `webServer` config
- Tests run on `http://localhost:3004` (configured in `playwright.config.ts`)
- Authentication handled by Clerk (requires proper setup)

## Writing New Tests

Follow existing test patterns:
- Clear state in `beforeEach`
- Use semantic locators (labels, roles)
- Verify navigation and data persistence
- Test both success and error paths
