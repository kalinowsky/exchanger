import { convertKeysToCamelCase } from "./helpers"
import { currencyResponseSchema } from "./schemas"
import { Currency } from "./types"

const CURRENCY_BEACON_BASE_URL = "https://api.currencybeacon.com/v1"

export const getApiUrl = (type: "currencies" | "convert") => {
  switch (type) {
    case "currencies":
      return `${CURRENCY_BEACON_BASE_URL}/currencies`
    case "convert":
      return `${CURRENCY_BEACON_BASE_URL}/convert`
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
    const response = await fetch(getApiUrl("currencies") + "?api_key=" + apiKey)
    const uknownResult = await response.json()
    const result = await currencyResponseSchema.parseAsync(uknownResult)
    const transformedResult = result.response.map(convertKeysToCamelCase)
    return { type: "Success", data: transformedResult }
  } catch (error) {
    console.log(error)
    return { type: "Error", message: "Could not fetch data" }
  }
}
