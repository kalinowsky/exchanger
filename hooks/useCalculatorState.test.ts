import { renderHook, waitFor } from "@testing-library/react" // <-- NOW

import { useCalculatorState } from "./useCalculatorState"
import { FetchCurrencyConvertionResult } from "@/utils/api"
import { Currency } from "@/utils/types"
import { act } from "react"

jest.mock("./useDebounce", () => ({
  useDebounce: jest.fn((state) => state),
}))

const mockConvert = jest.fn()

const currencies = [
  { shortCode: "PLN", name: "Polish Zloty" },
  { shortCode: "USD", name: "US Dollar" },
] as Currency[]

describe("useCalculatorState", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test("initial state is set correctly", () => {
    const { result } = renderHook(() => useCalculatorState({ currencies, convert: mockConvert }))

    expect(result.current.from).toEqual({ amount: "", currency: "PLN" })
    expect(result.current.to).toEqual({ amount: "", currency: "USD" })
    expect(result.current.result).toEqual({ type: "Idle" })
  })

  test("handles currency conversion", async () => {
    const mockConversionResult = {
      type: "Success",
      data: { value: 4.5, timestamp: new Date().getTime() },
    } as FetchCurrencyConvertionResult
    mockConvert.mockResolvedValue(mockConversionResult)

    const { result } = renderHook(() => useCalculatorState({ currencies, convert: mockConvert }))

    act(() => {
      result.current.onChange("from")({ amount: "100", currency: "PLN" })
    })

    await waitFor(() => expect(mockConvert).toHaveBeenCalledWith({ from: "PLN", to: "USD", amount: "100" }))
    expect(result.current.result).toEqual(mockConversionResult)
    expect(result.current.to.amount).toBe("4.50")
  })

  test("handles swap correctly", () => {
    const { result } = renderHook(() => useCalculatorState({ currencies, convert: mockConvert }))

    expect(result.current.to).toEqual({ amount: "", currency: "USD" })
    expect(result.current.from).toEqual({ amount: "", currency: "PLN" })

    act(() => {
      result.current.handleSwap()
    })

    expect(result.current.from).toEqual({ amount: "", currency: "USD" })
    expect(result.current.to).toEqual({ amount: "", currency: "PLN" })
  })

  test("sets result to IsLoading while fetching", async () => {
    const mockConversionResult = {
      type: "Success",
      data: { value: 4.5, timestamp: new Date().getTime() },
    } as FetchCurrencyConvertionResult
    mockConvert.mockResolvedValue(mockConversionResult)

    const { result } = renderHook(() => useCalculatorState({ currencies, convert: mockConvert }))

    act(() => {
      result.current.onChange("from")({ amount: "100", currency: "PLN" })
    })

    expect(result.current.result).toEqual({ type: "IsLoading" })

    await waitFor(() => expect(result.current.result).toEqual(mockConversionResult))
  })

  test("handles conversion error", async () => {
    const mockConversionError: FetchCurrencyConvertionResult = {
      type: "Error",
      message: "Conversion failed",
    }
    mockConvert.mockResolvedValue(mockConversionError)

    const { result } = renderHook(() => useCalculatorState({ currencies, convert: mockConvert }))

    act(() => {
      result.current.onChange("from")({ amount: "100", currency: "PLN" })
    })

    expect(mockConvert).toHaveBeenCalledWith({ from: "PLN", to: "USD", amount: "100" })
    expect(result.current.result).toEqual({ type: "IsLoading" })
    waitFor(() => expect(result.current.result.type).toEqual("Error"))
  })
})
