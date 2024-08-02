import { fetchCurrencies } from "@/utils/api"
import { CurrencyInput } from "./CurrencyInput"
import { Arrows } from "./Arrows"
import { Button } from "./Button"

export const Exchanger = async () => {
  const currenciesResult = await fetchCurrencies()

  if (currenciesResult.type === "Error") {
    console.error(currenciesResult.message)
    return <div>error</div>
  }

  return (
    <div className="bg-white h-[260px] min-w-[320px] w-full max-w-[800px] rounded-lg flex items-center justify-around drop-shadow-md	p-4">
      <div>
        <CurrencyInput currencies={currenciesResult.data} label="Amount" placeholder="From" />
      </div>
      <div className="mt-6">
        <Button rounded>
          <Arrows />
        </Button>
      </div>
      <div>
        <CurrencyInput currencies={currenciesResult.data} label="Converted to" placeholder="To" disabled />
      </div>
    </div>
  )
}
