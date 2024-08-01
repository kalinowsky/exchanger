import { z } from "zod"

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
  meta: z.object({
    code: z.number(),
    disclaimer: z.string(),
  }),
  response: z.array(currencySchema),
})
