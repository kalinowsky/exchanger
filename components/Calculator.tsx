"use client"
import { CurrencyInput } from "./CurrencyInput"
import { Arrows } from "./Arrows"
import { Button } from "./Button"
import { ConvertPayload, Currency } from "@/utils/types"
import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/useDebounce"
import { FetchCurrencyConvertionResult } from "@/utils/api"
import { convertPayloadSchema } from "@/utils/schemas"

type CurrencySelector = { amount: string; currency: string }

type State = {
  from: CurrencySelector
  to: CurrencySelector
  result?: FetchCurrencyConvertionResult
}

export const Calculator = ({
  currencies,
  convert,
}: {
  currencies: Currency[]
  convert: (p: ConvertPayload) => Promise<FetchCurrencyConvertionResult>
}) => {
  const [state, setState] = useState<State>({
    from: { amount: "", currency: "PLN" },
    to: { amount: "", currency: "USD" },
  })

  const debouncedState = useDebounce(state, 500)

  useEffect(() => {
    const fetchCurrencies = async (p: ConvertPayload) => {
      const result = await convert(p)
      if (result.type === "Error") return console.error(result.message)
      setState((s) => ({ ...s, to: { ...s.to, amount: result.data.value.toString() }, result }))
    }

    const result = convertPayloadSchema.safeParse({
      from: state.from.currency,
      to: state.to.currency,
      amount: state.from.amount,
    })

    if (result.success) fetchCurrencies(result.data)
  }, [debouncedState.from.amount, debouncedState.from.currency, debouncedState.to.currency])

  const handleSwap = () => {
    setState((s) => ({ from: s.to, to: { ...s.from, amount: "" } }))
  }

  return (
    <div className="flex flex-col	justify-center h-full relative">
      <div className="flex items-center justify-around mb-4">
        <div>
          <CurrencyInput
            currencies={currencies}
            label="Amount"
            placeholder="From"
            onChange={(v) => setState((s) => ({ ...s, from: v }))}
            defaultCurrency="PLN"
            value={state.from}
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
            onChange={(v) => setState((s) => ({ ...s, to: v }))}
            value={state.to}
            disabled
          />
        </div>
      </div>
      {state?.result?.type === "Success" && (
        <div className="text-sm text-gray-500 absolute bottom-0 left-0">
          Converted at {new Date(state.result.data.timestamp * 1000).toLocaleString()}
        </div>
      )}
    </div>
  )
}
