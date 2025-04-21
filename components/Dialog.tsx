import type { ReactNode } from 'react'

import classNames from 'classnames'
import IconButton from './IconButton' // Assuming IconButton exists for close
import closeIcon from '../assets/close.svg' // Assuming close icon exists

interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  width?: "fit" | "sm" | "md" | "lg" | "xl" | "full" // More standard width options
  className?: string
}

const Dialog = ({
  isOpen,
  onClose,
  title,
  children,
  width = "md", // Default width
  className,
}: DialogProps) => {
  if (!isOpen) {
    return null // Don't render anything if not open
  }

  const widthClasses = {
    fit: "w-fit",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "w-full max-w-none",
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={onClose} // Close on backdrop click
    >
      {/* Dialog Content */}
      <div
        className={classNames(
          "relative bg-[color:var(--c-bg)] border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,1)] p-6 w-full",
          widthClasses[width],
          className
        )}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside dialog
      >
        {/* Close Button */}
        <div className="absolute top-2 right-2">
          <IconButton
            icon={closeIcon}
            ariaLabel="Close Dialog" // Use ariaLabel instead of altText
            onClick={onClose}
            className="p-1 hover:bg-gray-200" // Basic styling
          />
        </div>

        {/* Optional Title */}
        {title && (
          <h2 className="text-2xl font-bold mb-4 border-b-[1px] border-b-[color:white] pb-2">
            {title}
          </h2>
        )}

        {/* Content Area */}
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Dialog
