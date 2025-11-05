import { z } from 'zod/v4-mini'

// DTO Schema - minimal validation for data transfer/storage
export const OrganizationDTOSchema = z.object({
  id: z.string().check(z.minLength(1)),
  slug: z.string().check(z.minLength(1)),
  logo: z.optional(z.string()),
  name: z.string().check(z.minLength(1)),
  phone: z.string().check(z.minLength(1)),
  province: z.string().check(z.minLength(1)),
  city: z.string().check(z.minLength(1)),
  address: z.string().check(z.minLength(1)),
  postalCode: z.string().check(z.minLength(1)),
  latitude: z.optional(z.number()),
  longitude: z.optional(z.number()),
  createdAt: z.string().check(z.minLength(1)),
  updatedAt: z.string().check(z.minLength(1)),
})

export type OrganizationDTO = z.infer<typeof OrganizationDTOSchema>

// Form Schema - user-friendly validation messages for forms
export const OrganizationFormDTOSchema = z.object({
  logo: z.optional(z.string()),
  name: z.string().check(z.minLength(1, 'Required')),
  phone: z.string().check(z.minLength(1, 'Required')),
  province: z.string().check(z.minLength(1, 'Required')),
  city: z.string().check(z.minLength(1, 'Required')),
  address: z.string().check(z.minLength(1, 'Required')),
  postalCode: z.string().check(z.minLength(1, 'Required')),
  latitude: z.optional(z.number()),
  longitude: z.optional(z.number()),
})

export type OrganizationFormDTO = z.infer<typeof OrganizationFormDTOSchema>

// Request body schema for updates - all fields optional
export const UpdateOrganizationRequestBodyDTOSchema = z.object({
  logo: z.optional(z.string()),
  name: z.optional(z.string().check(z.minLength(1))),
  phone: z.optional(z.string().check(z.minLength(1))),
  province: z.optional(z.string().check(z.minLength(1))),
  city: z.optional(z.string().check(z.minLength(1))),
  address: z.optional(z.string().check(z.minLength(1))),
  postalCode: z.optional(z.string().check(z.minLength(1))),
  latitude: z.optional(z.number()),
  longitude: z.optional(z.number()),
})

export type UpdateOrganizationRequestBodyDTO = z.infer<typeof UpdateOrganizationRequestBodyDTOSchema>

export function validateOrganizationForm(data: unknown): {
  success: boolean
  data?: OrganizationFormDTO
  errors?: Record<string, string>
} {
  const result = OrganizationFormDTOSchema.safeParse(data)

  if (!result.success) {
    const errors: Record<string, string> = {}
    result.error.issues.forEach((issue) => {
      const field = issue.path[0] as string
      if (field) {
        errors[field] = issue.message
      }
    })
    return { success: false, errors }
  }

  return { success: true, data: result.data }
}
