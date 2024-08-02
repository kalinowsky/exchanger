"use client"
import { CurrencyInput } from "./CurrencyInput"
import { Arrows } from "./Arrows"
import { Button } from "./Button"
import { ConvertPayload, Convertion, Currency, GetCurrencyConvertionResponse } from "@/utils/types"
import { useEffect, useState } from "react"
import { useDebounce } from "@/hooks/useDebounce"
import { FetchCurrencyConvertionResult, fetchConvert } from "@/utils/api"
import { convertPayloadSchema } from "@/utils/schemas"

type CurrencySelector = { amount: string; currency: string }

export const Calculator = ({
  currencies,
  convert,
}: {
  currencies: Currency[]
  convert: (p: ConvertPayload) => Promise<FetchCurrencyConvertionResult>
}) => {
  const [state, setState] = useState<{
    from: CurrencySelector
    to: CurrencySelector
  }>({ from: { amount: "", currency: "PLN" }, to: { amount: "", currency: "USD" } })

  const debouncedState = useDebounce(state, 500)

  useEffect(() => {
    const asdf = async (p: ConvertPayload) => {
      console.log(p)
      const res = await convert(p)
      if (res.type === "Error") return console.error(res.message)
      setState((s) => ({ ...s, to: { ...s.to, amount: res.data.value.toString() } }))
      console.log({ res })
    }

    const result = convertPayloadSchema.safeParse({
      from: state.from.currency,
      to: state.to.currency,
      amount: state.from.amount,
    })

    if (result.success) asdf(result.data)
  }, [debouncedState.from.amount, debouncedState.from.currency, debouncedState.to.currency])

  return (
    <>
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
        <Button rounded>
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
    </>
  )
}
