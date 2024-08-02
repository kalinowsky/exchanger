type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

export const Select: React.FC<SelectProps> = (props) => {
  return (
    <select
      {...props}
      className={`h-12 bg-gray-100 text-gray-900 border border-gray-300 rounded-md py-2 px-4 rounded-l-none	outline-none ${props.className}`}
    >
      {props.children}
    </select>
  )
}
