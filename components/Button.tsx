import { ButtonHTMLAttributes } from 'react'
import classNames from 'classnames'

// Extend standard button attributes and add custom props
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonText: string
  // Only allow size and className
  size?: "sm" | "md" | "lg"
  className?: string
}

const Button = ({
  buttonText = "enabled",
  size = "md",
  disabled,
  className,
  type = "button",
  onClick,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={classNames(
        "bg-[color:var(--c-accent)] text-[color:var(--c-fg)] border-[color:var(--c-accent)] border-2 font-bold text-lg lowercase rounded-md transition-all duration-150",
        "hover:bg-[color:var(--c-bg)] hover:text-[color:var(--c-accent)] hover:border-[color:var(--c-accent)] focus:bg-[color:var(--c-bg)] focus:text-[color:var(--c-accent)] focus:border-[color:var(--c-accent)]",
        {
          "h-10 px-4": size === "sm",
          "h-12 px-5": size === "md",
          "h-14 px-5": size === "lg",
          "opacity-60 cursor-not-allowed": disabled,
        },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {buttonText}
    </button>
  )
}


export default Button
