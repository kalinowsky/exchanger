"use client"
import { Currency } from "@/utils/types"
import { Select } from "./Select"
import { Input } from "./Input"
import { useEffect, useState } from "react"

type CurrencyInputProps = {
  currencies: Currency[]
  label: string
  defaultCurrency?: Currency["shortCode"]
  value: { amount: string; currency: Currency["shortCode"] }
  onChange: ({ amount, currency }: { amount: string; currency: Currency["shortCode"] }) => void
} & Pick<React.InputHTMLAttributes<HTMLInputElement>, "placeholder" | "disabled">

const regex = /^(\d+(\.\d{0,2})?)?$/

export const CurrencyInput = ({
  currencies,
  label,
  defaultCurrency,
  value,
  onChange,
  ...inputProps
}: CurrencyInputProps) => {
  const handleOnChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = e.target.value
    if (regex.test(amount) || amount === "") {
      onChange({ ...value, amount })
    }
  }

  const handleOnChangeSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const currency = e.target.value
    onChange({ ...value, currency })
  }

  return (
    <div>
      <div className="text-gray-500 text-sm	mb-1">{label}</div>
      <div className="currency-input relative">
        <Input {...inputProps} onChange={handleOnChangeInput} value={value.amount} />
        <Select name="Currencies" onChange={handleOnChangeSelect} value={value.currency}>
          {currencies.map((currency) => (
            <option key={`from-${currency.shortCode}`} value={currency.shortCode}>
              {currency.shortCode}
            </option>
          ))}
        </Select>
      </div>
    </div>
  )
}
