import { useEffect, useState } from "react"
import { useDebounce } from "./useDebounce"
import { convertPayloadSchema } from "@/utils/schemas"
import { ConvertPayload, Currency } from "@/utils/types"
import { FetchCurrencyConvertionResult } from "@/utils/api"

type CurrencySelector = { amount: string; currency: string }

type State = {
  from: CurrencySelector
  to: CurrencySelector
  result: FetchCurrencyConvertionResult | { type: "IsLoading" } | { type: "Idle" }
}

type Args = {
  currencies: Currency[]
  convert: (p: ConvertPayload) => Promise<FetchCurrencyConvertionResult>
}

export const useCalculatorState = ({ currencies, convert }: Args) => {
  const [state, setState] = useState<State>({
    from: { amount: "", currency: "PLN" },
    to: { amount: "", currency: "USD" },
    result: { type: "Idle" },
  })

  const debouncedState = useDebounce(state, 500)

  useEffect(() => {
    const fetchConvert = async (p: ConvertPayload) => {
      setState((s) => ({ ...s, result: { type: "IsLoading" } }))
      const result = await convert(p)
      if (result.type === "Error") {
        setState((s) => ({ ...s, result }))
        return
      }
      setState((s) => ({
        ...s,
        to: { ...s.to, amount: result.data.value.toFixed(2).toString() },
        result,
      }))
    }

    const result = convertPayloadSchema.safeParse({
      from: state.from.currency,
      to: state.to.currency,
      amount: state.from.amount,
    })

    if (result.success) fetchConvert(result.data)
  }, [debouncedState.from.amount, debouncedState.from.currency, debouncedState.to.currency])

  const handleSwap = () => {
    setState((s) => ({ ...s, from: { ...s.to, amount: s.from.amount }, to: { ...s.from, amount: "" } }))
  }

  const onChange = (key: "from" | "to") => (values: { amount: string; currency: Currency["shortCode"] }) => {
    setState((s) => ({ ...s, [key]: values }))
  }

  return {
    handleSwap,
    from: state.from,
    to: state.to,
    result: state.result,
    onChange,
  }
}
