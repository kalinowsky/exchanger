import { z } from "zod"
import { ConvertKeysToCamelCase, convertKeysToCamelCase } from "./helpers"
import { currencyConversionSchema, currencyResponseSchema } from "./schemas"
import { Convertion, Currency } from "./types"

const CURRENCY_BEACON_BASE_URL = "https://api.currencybeacon.com/v1"

type ApiUrl =
  | {
      type: "currencies"
    }
  | {
      type: "convert"
      payload: {
        from: string
        to: string
        amount: string
      }
    }
export const getApiUrl = (url: ApiUrl) => {
  switch (url.type) {
    case "currencies":
      return `${CURRENCY_BEACON_BASE_URL}/currencies?`
    case "convert":
      return `${CURRENCY_BEACON_BASE_URL}/convert?${new URLSearchParams(url.payload).toString()}`
  }
}

type MakeApiResult<T> = { type: "Success"; data: T } | { type: "Error"; message: string }

export const fetchData = async <T extends z.ZodTypeAny>(
  urlWithParams: string,
  schema: T,
  refetchConfig?: NextFetchRequestConfig
): Promise<MakeApiResult<ConvertKeysToCamelCase<z.TypeOf<T>>>> => {
  const apiKey = process.env.CURRENCY_BEACON_API_KEY
  if (apiKey === undefined) {
    return { type: "Error", message: "API key not found" }
  }

  try {
    const response = await fetch(`${urlWithParams}&api_key=${apiKey}`, {
      next: refetchConfig,
    })
    const uknownResult = await response.json()
    const result = await schema.parseAsync(uknownResult)
    const transformedResult = convertKeysToCamelCase(result)
    return { type: "Success", data: transformedResult as ConvertKeysToCamelCase<z.TypeOf<T>> }
  } catch (error) {
    return { type: "Error", message: "Could not fetch data" }
  }
}

export const fetchCurrencies = () =>
  fetchData(getApiUrl({ type: "currencies" }), currencyResponseSchema, { revalidate: 60 })

export const fetchConvert = (params: { from: string; to: string; amount: string }) =>
  fetchData(getApiUrl({ type: "convert", payload: params }), currencyConversionSchema)

export type FetchCurrencyConvertionResult = MakeApiResult<Convertion>
