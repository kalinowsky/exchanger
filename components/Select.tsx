type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>

export const Select: React.FC<SelectProps> = (props) => {
  return (
    <select
      {...props}
      className={`h-12 bg-gray-100 text-gray-900 border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${props.className}`}
    >
      {props.children}
    </select>
  )
}
