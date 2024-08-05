"use client"
import { CurrencyInput } from "./CurrencyInput"
import { Arrows } from "./Arrows"
import { Button } from "./Button"
import { ConvertPayload, Currency } from "@/utils/types"
import { FetchCurrencyConvertionResult } from "@/utils/api"
import { useCalculatorState } from "@/hooks/useCalculatorState"

export const Calculator = ({
  currencies,
  convert,
}: {
  currencies: Currency[]
  convert: (p: ConvertPayload) => Promise<FetchCurrencyConvertionResult>
}) => {
  const { handleSwap, from, to, result, onChange } = useCalculatorState({ currencies, convert })

  return (
    <div className="flex flex-col	justify-center h-full relative">
      <div className="flex items-center justify-around mb-4">
        <div>
          <CurrencyInput
            currencies={currencies}
            label="Amount"
            placeholder="From"
            onChange={onChange("from")}
            defaultCurrency="PLN"
            value={from}
          />
        </div>
        <div className="mt-6">
          <Button rounded onClick={handleSwap}>
            <Arrows />
          </Button>
        </div>
        <div>
          <CurrencyInput
            currencies={currencies}
            label="Converted to"
            placeholder="To"
            defaultCurrency="USD"
            onChange={onChange("to")}
            value={to}
            disabled
          />
        </div>
      </div>

      <div className="text-sm text-gray-500 absolute bottom-0 left-0">
        {result.type === "IsLoading"
          ? "Loading..."
          : result?.type === "Success"
          ? `Converted at ${new Date(result.data.timestamp * 1000).toLocaleString()}`
          : ""}
      </div>
    </div>
  )
}
