import { fetchCurrencies } from "@/utils/api"
import { CurrencyInput } from "./CurrencyInput"

export const Exchanger = async () => {
  const currenciesResult = await fetchCurrencies()

  if (currenciesResult.type === "Error") {
    console.error(currenciesResult.message)
    return <div>error</div>
  }

  return (
    <div className="bg-white h-[320px] min-w-[320px] w-full max-w-[800px] rounded-lg flex items-center justify-around drop-shadow-md	">
      <div>
        <CurrencyInput currencies={currenciesResult.data} />
      </div>
      <div>
        <CurrencyInput currencies={currenciesResult.data} />
      </div>
    </div>
  )
}
