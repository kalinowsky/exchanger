import { fetchConvert, fetchCurrencies } from "@/utils/api"
import { Calculator } from "./Calculator"
import { ConvertPayload } from "@/utils/types"

export const Exchanger = async () => {
  const currenciesResult = await fetchCurrencies()

  if (currenciesResult.type === "Error") {
    console.error(currenciesResult.message)
    return <div>error</div>
  }

  const convert = async (payload: ConvertPayload) => {
    "use server"
    return fetchConvert(payload)
  }

  return (
    <div className="bg-white h-[260px] min-w-[320px] w-full max-w-[800px] rounded-lg flex items-center justify-around drop-shadow-md	p-4">
      <Calculator currencies={currenciesResult.data} convert={convert} />
    </div>
  )
}
