import { fetchCurrencies } from "@/utils/api"

export const Exchanger = async () => {
  const currenciesResult = await fetchCurrencies()

  if (currenciesResult.type === "Error") {
    console.error(currenciesResult.message)
    return <div>error</div>
  }

  return (
    <div className="bg-white h-24 min-w-[320px] w-full max-w-[800px] rounded-lg">
      <select name="Currencies">
        {currenciesResult.data.map((currency) => (
          <option key={currency.id} value={currency.id}>
            {currency.name}
          </option>
        ))}
      </select>
    </div>
  )
}
