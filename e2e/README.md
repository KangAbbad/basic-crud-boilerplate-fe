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

## Important Notes

- Tests clear IndexedDB before each test for clean state
- Dev server starts automatically via `webServer` config
- Tests run on `http://localhost:3006` (configured in `playwright.config.ts`)
- Authentication handled by Clerk (requires proper setup)

## Writing New Tests

Follow existing test patterns:
- Clear state in `beforeEach`
- Use semantic locators (labels, roles)
- Verify navigation and data persistence
- Test both success and error paths
