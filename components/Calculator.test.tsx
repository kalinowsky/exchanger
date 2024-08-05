import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import { Calculator } from "./Calculator"
import { ConvertPayload, Convertion, Currency } from "@/utils/types"
import { FetchCurrencyConvertionResult } from "@/utils/api"

const mockCurrencies: Currency[] = [
  { shortCode: "USD", name: "United States Dollar" } as Currency,
  { shortCode: "PLN", name: "Polish Zloty" } as Currency,
]

type ConvertFn = (payload: ConvertPayload) => Promise<FetchCurrencyConvertionResult>
const mockConvert: ConvertFn = async (p) => {
  if (p.amount === "invalid") {
    return Promise.resolve({ type: "Error", message: "Invalid amount" })
  }
  return Promise.resolve({
    type: "Success",
    data: {
      value: 123.45,
      timestamp: Date.now() / 1000,
    } as Convertion,
  })
}

describe("Calculator Component", () => {
  test("renders without crashing", () => {
    render(<Calculator currencies={mockCurrencies} convert={mockConvert} />)
    expect(screen.getByText(/Amount/i)).toBeInTheDocument()
    expect(screen.getByText(/Converted to/i)).toBeInTheDocument()
  })

  test("performs currency conversion on valid input", async () => {
    render(<Calculator currencies={mockCurrencies} convert={mockConvert} />)

    const inputFrom = screen.getByPlaceholderText("From")
    fireEvent.change(inputFrom, { target: { value: "100" } })

    await waitFor(() => {
      expect(screen.getByDisplayValue("123.45")).toBeInTheDocument()
    })
  })

  test("handles invalid input gracefully", async () => {
    render(<Calculator currencies={mockCurrencies} convert={mockConvert} />)

    const inputFrom = screen.getByPlaceholderText("From")
    fireEvent.change(inputFrom, { target: { value: "invalid" } })

    await waitFor(() => {
      expect(screen.queryByDisplayValue("123.45")).not.toBeInTheDocument()
    })
  })

  test("swaps currencies when the swap button is clicked", () => {
    render(<Calculator currencies={mockCurrencies} convert={mockConvert} />)

    const inputFrom = screen.getByPlaceholderText("From")
    fireEvent.change(inputFrom, { target: { value: "100" } })

    const swapButton = screen.getByRole("button")
    fireEvent.click(swapButton)

    expect(screen.getByPlaceholderText("From")).toHaveValue("100")
    expect(screen.getByPlaceholderText("To")).toHaveValue("")
  })
})
