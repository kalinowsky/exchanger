"use client"
import React from "react"

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

export const Input: React.FC<InputProps> = (props) => {
  return (
    <input
      {...props}
      className={`h-12 w-[300px] bg-gray-100 text-gray-900 border border-gray-300 rounded-md py-2 px-4 outline-none	${props.className}`}
    />
  )
}
