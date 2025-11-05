import { z } from 'zod/v4-mini'

// ===== ENUMS =====

export const DataStatusDTOSchema = z.enum(['draft', 'completed', 'cancelled'])

// ===== CORE DTO =====

export const DataDTOSchema = z.object({
  id: z.string(),
  slug: z.string(),
  organizationId: z.string(),
  name: z.string(),
  phone: z.string(),
  price: z.string(),
  quantity: z.string(),
  weight: z.string(),
  date: z.string(),
  notes: z.string(),
  status: DataStatusDTOSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
})

// ===== FORM SCHEMAS =====

export const CreateDataFormDTOSchema = z.object({
  organizationId: z.string().check(z.minLength(1, 'Required')),
  name: z.string().check(z.minLength(1, 'Required')),
  phone: z.string().check(z.minLength(1, 'Required')),
  price: z.string().check(z.minLength(1, 'Required')),
  quantity: z.string().check(z.minLength(1, 'Required')),
  weight: z.string().check(z.minLength(1, 'Required')),
  date: z.string().check(z.minLength(1, 'Required')),
  notes: z.string().check(z.minLength(1, 'Required')),
})

export const UpdateDataFormDTOSchema = z.object({
  organizationId: z.string().check(z.minLength(1, 'Required')),
  name: z.string().check(z.minLength(1, 'Required')),
  phone: z.string().check(z.minLength(1, 'Required')),
  price: z.string().check(z.minLength(1, 'Required')),
  quantity: z.string().check(z.minLength(1, 'Required')),
  weight: z.string().check(z.minLength(1, 'Required')),
  date: z.string().check(z.minLength(1, 'Required')),
  notes: z.string().check(z.minLength(1, 'Required')),
  status: z.optional(DataStatusDTOSchema),
})

// ===== TYPE INFERENCES =====

export type DataStatusDTO = z.infer<typeof DataStatusDTOSchema>
export type DataDTO = z.infer<typeof DataDTOSchema>
export type CreateDataFormDTO = z.infer<typeof CreateDataFormDTOSchema>
export type UpdateDataFormDTO = z.infer<typeof UpdateDataFormDTOSchema>
