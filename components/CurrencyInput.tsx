import { Currency } from "@/utils/types"
import { Select } from "./Select"
import { Input } from "./Input"

export const CurrencyInput = ({ currencies }: { currencies: Currency[] }) => {
  return (
    <div className="something relative">
      <Input placeholder="From" />
      <Select name="Currencies">
        {currencies.map((currency) => (
          <option key={`from-${currency.id}`} value={currency.id}>
            {currency.shortCode}
          </option>
        ))}
      </Select>
    </div>
  )
}
