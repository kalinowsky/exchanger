import { z } from "zod"

const metaSchema = z.object({
  code: z.number(),
  disclaimer: z.string(),
})

const currencySchema = z.object({
  id: z.number(),
  name: z.string(),
  short_code: z.string(),
  code: z.string(),
  precision: z.number(),
  subunit: z.number(),
  symbol: z.string(),
  symbol_first: z.boolean(),
  decimal_mark: z.string(),
  thousands_separator: z.string(),
})

export const currencyResponseSchema = z.object({
  meta: metaSchema,
  response: z.array(currencySchema),
})

const convertionResponseSchema = z.object({
  timestamp: z.number(),
  date: z.string(),
  from: z.string(),
  to: z.string(),
  amount: z.number(),
  value: z.number(),
})

export const currencyConversionSchema = z.object({
  meta: metaSchema,
  response: convertionResponseSchema,
  timestamp: z.number(),
  date: z.string(),
  from: z.string(),
  to: z.string(),
  amount: z.number(),
  value: z.number(),
})

export const convertPayloadSchema = z.object({
  from: z.string().length(3),
  to: z.string().length(3),
  amount: z.string().refine((value) => value !== "" && !isNaN(Number(value))),
})
