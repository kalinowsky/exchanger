import { z } from "zod"
import { currencyResponseSchema } from "./schemas"
import { ConvertKeysToCamelCase } from "./helpers"

export type GetCurrenciesResponse = z.infer<typeof currencyResponseSchema>
export type CurrencyResponse = GetCurrenciesResponse["response"][0]

export type Currency = ConvertKeysToCamelCase<CurrencyResponse>
