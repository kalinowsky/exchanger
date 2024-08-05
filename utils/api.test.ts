import { fetchCurrencies } from "./api"

const mockApiResponse = {
  meta: {
    code: 200,
    disclaimer: "Usage subject to terms: https://currencybeacon.com/terms",
  },
  response: [
    {
      id: 114,
      name: "Zloty",
      short_code: "PLN",
      code: "985",
      precision: 2,
      subunit: 100,
      symbol: "zł",
      symbol_first: false,
      decimal_mark: ",",
      thousands_separator: " ",
    },
  ],
}

describe("fetchCurrencies", () => {
  beforeEach(() => {
    jest.resetAllMocks()
    process.env.CURRENCY_BEACON_API_KEY = "mockApiKey"
  })

  test("returns and tranform currencies successfully", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockApiResponse),
      })
    ) as any

    const result = await fetchCurrencies()

    expect(result).toEqual({
      type: "Success",
      data: [
        {
          id: 114,
          name: "Zloty",
          shortCode: "PLN",
          code: "985",
          precision: 2,
          subunit: 100,
          symbol: "zł",
          symbolFirst: false,
          decimalMark: ",",
          thousandsSeparator: " ",
        },
      ],
    })
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("https://api.currencybeacon.com/v1/currencies?&api_key=mockApiKey"),
      { next: { revalidate: 60 } }
    )
  })

  test("returns error if API key is missing", async () => {
    delete process.env.CURRENCY_BEACON_API_KEY

    const result = await fetchCurrencies()

    expect(result).toEqual({ type: "Error", message: "API key not found" })
  })

  test("returns error if fetch fails", async () => {
    global.fetch = jest.fn(() => Promise.reject("Fetch error"))

    const result = await fetchCurrencies()

    expect(result).toEqual({ type: "Error", message: "Could not fetch data" })
  })

  test("returns error if schema is different than expected", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ ...mockApiResponse, response: [{ id: 123 }] }),
      })
    ) as any
    const result = await fetchCurrencies()

    expect(result).toEqual({ type: "Error", message: "Could not fetch data" })
  })
})
