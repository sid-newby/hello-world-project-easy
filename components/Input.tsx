import { InputHTMLAttributes } from 'react'
import classNames from 'classnames'

// Extend standard input attributes and add custom props
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string // Optional label text
  focusColor?:
    | "violet"
    | "pink"
    | "red"
    | "orange"
    | "yellow"
    | "lime"
    | "cyan"
  rounded?: "none" | "md" | "full"
  // className applies to the wrapper div now
}

const Input = ({
  label,
  id, // Use id for label association
  placeholder,
  focusColor = "pink",
  rounded = "none",
  className,
  type = "text", // Default type to text
  value,
  onChange,
  required,
  ...props // Pass rest of the props to the input element
}: InputProps) => {

  // Ensure id is present if label is provided for accessibility
  const inputId = id || (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined)

  return (
    <div className={classNames("w-full", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-bold text-[color:var(--c-fg)] mb-1" // Basic label styling
        >
          {label}{required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={classNames(
          "w-full bg-[color:var(--c-bg)] text-[color:var(--c-fg)] border-[var(--c-stroke)] border-[1px] p-2.5 focus:outline-none focus:shadow-[var(--shadow-brutal)] focus:placeholder:text-[color:var(--c-fg)] active:shadow-[var(--shadow-brutal)]",
          // Apply focus colors based on prop - all using the accent color but with different intensities
          { "focus:border-[var(--c-accent)]": focusColor === "violet" },
          { "focus:border-[var(--c-accent)]": focusColor === "pink" },
          { "focus:border-[var(--c-accent)]": focusColor === "red" },
          { "focus:border-[var(--c-accent)]": focusColor === "orange" },
          { "focus:border-[var(--c-accent)]": focusColor === "yellow" },
          { "focus:border-[var(--c-accent)]": focusColor === "lime" },
          { "focus:border-[var(--c-accent)]": focusColor === "cyan" },
          // Apply rounded corners based on prop
          { "rounded-none": rounded === "none" },
          { "rounded-md": rounded === "md" },
          { "rounded-full": rounded === "full" }
        )}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        {...props} // Spread remaining props (like name, disabled, etc.)
      />
    </div>
  )
}

export default Input
