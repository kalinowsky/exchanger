import { Currency } from "@/utils/types"
import { Select } from "./Select"
import { Input } from "./Input"

type CurrencyInputProps = {
  currencies: Currency[]
  label: string
  placeholder?: string
  disabled?: boolean
}
export const CurrencyInput = ({ currencies, label, placeholder, disabled }: CurrencyInputProps) => {
  return (
    <div>
      <div className="text-gray-500 text-sm	mb-1">{label}</div>
      <div className="currency-input relative">
        <Input placeholder={placeholder} disabled={disabled} />
        <Select name="Currencies">
          {currencies.map((currency) => (
            <option key={`from-${currency.id}`} value={currency.id}>
              {currency.shortCode}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
