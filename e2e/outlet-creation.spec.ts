import { test, expect } from '@playwright/test'

test.describe('Outlet Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to root first
    await page.goto('/')

    // Wait for authentication to load
    await page.waitForLoadState('networkidle')

    // Clear IndexedDB before each test to ensure clean state
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        const request = indexedDB.deleteDatabase('qlover-laundry-pos')
        request.onsuccess = () => {
          resolve()
        }
        request.onerror = () => {
          resolve()
        }
      })
    })
  })

  test('should create a new outlet successfully', async ({ page }) => {
    // Navigate to outlet form
    await page.goto('/outlets/form')

    // Wait for form to be visible (title is "Buat Outlet" in create mode)
    await expect(page.getByText('Buat Outlet')).toBeVisible()

    // Fill in required fields
    await page.getByLabel('Nama *').fill('Test Outlet Laundry')
    await page.getByLabel('Telepon *').fill('081234567890')

    // Select province (DKI Jakarta)
    await page.getByLabel('Provinsi *').click()
    await page.getByRole('option', { name: 'DKI Jakarta' }).click()

    // Select city (Jakarta Selatan)
    await page.getByLabel('Kota *').click()
    await page.getByRole('option', { name: 'Jakarta Selatan' }).click()

    // Fill address
    await page.getByLabel('Alamat *').fill('Jl. Sudirman No. 123, Senayan, Jakarta Selatan')

    // Fill postal code
    await page.getByLabel('Kode Pos *').fill('12190')

    // Submit form
    await page.getByRole('button', { name: 'Simpan' }).click()

    // Verify navigation to outlets list
    await expect(page).toHaveURL('/outlets')

    // Verify outlet appears in the list
    await expect(page.getByText('Test Outlet Laundry')).toBeVisible()
    await expect(page.getByText('081234567890')).toBeVisible()
  })

  test('should show validation errors for required fields', async ({ page }) => {
    // Navigate to outlet form
    await page.goto('/outlets/form')

    // Wait for form to be visible
    await expect(page.getByText('Buat Outlet')).toBeVisible()

    // Try to submit without filling any fields
    await page.getByRole('button', { name: 'Simpan' }).click()

    // Verify validation errors appear (4 "Wajib diisi" + 2 "Wajib dipilih")
    await expect(page.getByText('Wajib diisi')).toHaveCount(4)
    await expect(page.getByText('Wajib dipilih')).toHaveCount(2)
  })

  test('should cancel outlet creation and navigate back to list', async ({ page }) => {
    // Navigate to outlet form
    await page.goto('/outlets/form')

    // Wait for form to be visible
    await expect(page.getByText('Buat Outlet')).toBeVisible()

    // Fill some data
    await page.getByLabel('Nama *').fill('Test Outlet')

    // Click back/cancel button (arrow icon in header)
    await page.locator('button').first().click()

    // Verify navigation back to outlets list
    await expect(page).toHaveURL('/outlets')
  })

  test('should edit existing outlet', async ({ page }) => {
    // First, create an outlet
    await page.goto('/outlets/form')
    await page.getByLabel('Nama *').fill('Original Outlet Name')
    await page.getByLabel('Telepon *').fill('081234567890')
    await page.getByLabel('Provinsi *').click()
    await page.getByRole('option', { name: 'DKI Jakarta' }).click()
    await page.getByLabel('Kota *').click()
    await page.getByRole('option', { name: 'Jakarta Selatan' }).click()
    await page.getByLabel('Alamat *').fill('Jl. Test No. 1')
    await page.getByLabel('Kode Pos *').fill('12190')
    await page.getByRole('button', { name: 'Simpan' }).click()

    // Wait for navigation to list
    await expect(page).toHaveURL('/outlets')
    await expect(page.getByText('Original Outlet Name')).toBeVisible()

    // Click edit button (yellow button = bg-warning class)
    await page.locator('button.bg-warning').first().click()

    // Wait for navigation to edit form (URL contains slug parameter)
    await page.waitForURL(/\/outlets\/form\?slug=/)

    // Wait for form to load with existing data (title is "Ubah Outlet" in edit mode)
    await expect(page.getByText('Ubah Outlet')).toBeVisible()
    await expect(page.getByLabel('Nama *')).toHaveValue('Original Outlet Name')

    // Update the name
    await page.getByLabel('Nama *').fill('Updated Outlet Name')

    // Save changes
    await page.getByRole('button', { name: 'Simpan' }).click()

    // Verify navigation back to list
    await expect(page).toHaveURL('/outlets')

    // Verify updated outlet appears in the list
    await expect(page.getByText('Updated Outlet Name')).toBeVisible()
    await expect(page.getByText('Original Outlet Name')).not.toBeVisible()
  })

  test('should handle city dropdown dependency on province selection', async ({ page }) => {
    // Navigate to outlet form
    await page.goto('/outlets/form')

    // City dropdown should be disabled initially
    const cityField = page.getByLabel('Kota *')
    await expect(cityField).toBeDisabled()

    // Select a province
    await page.getByLabel('Provinsi *').click()
    await page.getByRole('option', { name: 'DKI Jakarta' }).click()

    // City dropdown should now be enabled
    await expect(cityField).toBeEnabled()

    // Should show cities for selected province
    await cityField.click()
    await expect(page.getByRole('option', { name: 'Jakarta Selatan' })).toBeVisible()
  })

  test('should upload and remove logo image', async ({ page }) => {
    // Navigate to outlet form
    await page.goto('/outlets/form')

    // Wait for form to be visible
    await expect(page.getByText('Buat Outlet')).toBeVisible()

    // Verify file input exists
    const fileInput = page.locator('input[type="file"]')
    await expect(fileInput).toBeVisible()

    // Create a test image file (1x1 PNG)
    const buffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    )

    // Upload image
    await fileInput.setInputFiles({
      name: 'test-logo.png',
      mimeType: 'image/png',
      buffer,
    })

    // Wait for image to be processed and displayed
    await expect(page.locator('img[alt="Outlet logo"]')).toBeVisible()

    // Verify remove button appears
    const removeButton = page.getByRole('button', { name: 'Hapus Gambar' })
    await expect(removeButton).toBeVisible()

    // Click remove button
    await removeButton.click()

    // Verify image is removed
    await expect(page.locator('img[alt="Outlet logo"]')).not.toBeVisible()
    await expect(removeButton).not.toBeVisible()
  })

  test('should create outlet with logo and location', async ({ page }) => {
    // Navigate to outlet form
    await page.goto('/outlets/form')

    // Fill required fields
    await page.getByLabel('Nama *').fill('Outlet With Logo')
    await page.getByLabel('Telepon *').fill('081234567890')
    await page.getByLabel('Provinsi *').click()
    await page.getByRole('option', { name: 'DKI Jakarta' }).click()
    await page.getByLabel('Kota *').click()
    await page.getByRole('option', { name: 'Jakarta Selatan' }).click()
    await page.getByLabel('Alamat *').fill('Jl. Test No. 1')
    await page.getByLabel('Kode Pos *').fill('12190')

    // Upload logo
    const buffer = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
      'base64'
    )
    await page.locator('input[type="file"]').setInputFiles({
      name: 'logo.png',
      mimeType: 'image/png',
      buffer,
    })

    // Verify logo preview
    await expect(page.locator('img[alt="Outlet logo"]')).toBeVisible()

    // Open location picker modal
    const locationButton = page.getByRole('button', { name: 'Pilih Lokasi dari Map' })
    await expect(locationButton).toBeVisible()
    await locationButton.click()

    // Wait for modal to open - target the h2 heading specifically
    await expect(page.getByRole('heading', { name: 'Pilih Lokasi' })).toBeVisible()

    // Wait for map to load (Leaflet renders as .leaflet-container)
    await page.locator('.leaflet-container').first().waitFor({ state: 'visible' })

    // Click on map to select location
    await page
      .locator('.leaflet-container')
      .first()
      .click({ position: { x: 100, y: 100 } })

    // Click "Konfirmasi Lokasi" button to close modal
    await page.getByRole('button', { name: 'Konfirmasi Lokasi' }).click()

    // Wait for modal to close - target the h2 heading
    await expect(page.getByRole('heading', { name: 'Pilih Lokasi' })).not.toBeVisible()

    // Submit form
    await page.getByRole('button', { name: 'Simpan' }).click()

    // Verify navigation to outlets list
    await expect(page).toHaveURL('/outlets')

    // Verify outlet appears in the list
    await expect(page.getByText('Outlet With Logo')).toBeVisible()
  })

  test('should show all form fields on page load', async ({ page }) => {
    // Navigate to outlet form
    await page.goto('/outlets/form')

    // Wait for form to be visible
    await expect(page.getByText('Buat Outlet')).toBeVisible()

    // Verify all fields are present
    await expect(page.locator('input[type="file"]')).toBeVisible() // Logo field
    await expect(page.getByLabel('Nama *')).toBeVisible()
    await expect(page.getByLabel('Telepon *')).toBeVisible()
    await expect(page.getByLabel('Provinsi *')).toBeVisible()
    await expect(page.getByLabel('Kota *')).toBeVisible()
    await expect(page.getByLabel('Alamat *')).toBeVisible()
    await expect(page.getByLabel('Kode Pos *')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Pilih Lokasi dari Map' })).toBeVisible() // Location field

    // Verify form buttons
    await expect(page.getByRole('button', { name: 'Simpan' })).toBeVisible()
    // Cancel is the back arrow button in header (icon-only, no "Batal" button exists)
  })
})
