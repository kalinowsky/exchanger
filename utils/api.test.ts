import { z } from "zod"
import { fetchData } from "./api"

const mockSchema = z.object({
  snake_case_key: z.string(),
  nested: z.object({
    nested_snake_case_key: z.string(),
  }),
})

const mockApiResponse = {
  snake_case_key: "value",
  nested: {
    nested_snake_case_key: "nestedValue",
  },
}

const mockConvertedData = {
  snakeCaseKey: "value",
  nested: {
    nestedSnakeCaseKey: "nestedValue",
  },
}

describe("fetchData", () => {
  beforeEach(() => {
    jest.resetAllMocks()
    process.env.CURRENCY_BEACON_API_KEY = "mockApiKey"
  })

  test("returns data successfully and properly transformed", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockApiResponse),
      })
    ) as any

    const urlWithParams = "https://api.currencybeacon.com/v1/test?"
    const result = await fetchData(urlWithParams, mockSchema)

    expect(result).toEqual({ type: "Success", data: mockConvertedData })
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining(`${urlWithParams}&api_key=mockApiKey`), {
      next: undefined,
    })
  })

  test("returns data successfully and pass next fetch request config", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockApiResponse),
      })
    ) as any

    const urlWithParams = "https://api.currencybeacon.com/v1/test?"
    const result = await fetchData(urlWithParams, mockSchema, { revalidate: 60 })

    expect(result).toEqual({ type: "Success", data: mockConvertedData })
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining(`${urlWithParams}&api_key=mockApiKey`), {
      next: { revalidate: 60 },
    })
  })

  test("returns error if API key is missing", async () => {
    delete process.env.CURRENCY_BEACON_API_KEY

    const urlWithParams = "https://api.currencybeacon.com/v1/test?"
    const result = await fetchData(urlWithParams, mockSchema)

    expect(result).toEqual({ type: "Error", message: "API key not found" })
  })

  test("returns error if fetch fails", async () => {
    global.fetch = jest.fn(() => Promise.reject("Fetch error"))

    const urlWithParams = "https://api.currencybeacon.com/v1/test?"
    const result = await fetchData(urlWithParams, mockSchema)

    expect(result).toEqual({ type: "Error", message: "Could not fetch data" })
  })

  test("returns error if schema parsing fails", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockApiResponse),
      })
    ) as any

    mockSchema.parseAsync = jest.fn().mockRejectedValue(new Error("Schema parsing error"))

    const urlWithParams = "https://api.currencybeacon.com/v1/test?"
    const result = await fetchData(urlWithParams, mockSchema)

    expect(result).toEqual({ type: "Error", message: "Could not fetch data" })
  })
})
