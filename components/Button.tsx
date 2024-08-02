import React from "react"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  rounded?: boolean
}

export const Button: React.FC<ButtonProps> = ({ rounded, className, ...props }) => {
  return (
    <button
      {...props}
      className={`h-12 w-[150px] bg-blue-500 text-white border border-blue-700 py-2 px-4 outline-none flex justify-center items-center ${
        rounded ? "rounded-full h-12 w-24" : "rounded-md"
      } ${className}`}
    />
  )
}
