import { z } from "zod"
import { convertPayloadSchema, currencyConversionSchema, currencyResponseSchema } from "./schemas"
import { ConvertKeysToCamelCase } from "./helpers"

export type GetCurrenciesResponse = z.infer<typeof currencyResponseSchema>
export type CurrencyResponse = GetCurrenciesResponse["response"][0]
export type Currency = ConvertKeysToCamelCase<CurrencyResponse>

export type GetCurrencyConvertionResponse = z.infer<typeof currencyConversionSchema>
export type Convertion = ConvertKeysToCamelCase<GetCurrencyConvertionResponse["response"]>

export type ConvertPayload = z.infer<typeof convertPayloadSchema>
