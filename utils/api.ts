import { convertKeysToCamelCase } from "./helpers"
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

type FetchCurrenciesResult = MakeApiResult<Currency[]>

export const fetchCurrencies = async (): Promise<FetchCurrenciesResult> => {
  const apiKey = process.env.CURRENCY_BEACON_API_KEY
  if (apiKey === undefined) {
    return { type: "Error", message: "API key not found" }
  }

  try {
    const response = await fetch(getApiUrl({ type: "currencies" }) + "&api_key=" + apiKey)
    const uknownResult = await response.json()
    const result = await currencyResponseSchema.parseAsync(uknownResult)
    const transformedResult = result.response.map(convertKeysToCamelCase)
    return { type: "Success", data: transformedResult }
  } catch (error) {
    console.log(error)
    return { type: "Error", message: "Could not fetch data" }
  }
}

export type FetchCurrencyConvertionResult = MakeApiResult<Convertion>

export const fetchConvert = async (params: {
  from: string
  to: string
  amount: string
}): Promise<FetchCurrencyConvertionResult> => {
  const apiKey = process.env.CURRENCY_BEACON_API_KEY
  if (apiKey === undefined) {
    return { type: "Error", message: "API key not found" }
  }

  try {
    const url = getApiUrl({ type: "convert", payload: params }) + "&api_key=" + apiKey
    console.log({ url })
    const response = await fetch(url)
    const uknownResult = await response.json()
    const result = await currencyConversionSchema.parseAsync(uknownResult)
    return { type: "Success", data: result.response }
  } catch (error) {
    console.log(error)
    return { type: "Error", message: "Could not fetch data" }
  }
}
