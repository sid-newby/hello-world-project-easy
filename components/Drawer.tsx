import { ReactNode } from 'react' // Removed React import
import Button from './Button' // For close button

interface DrawerProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

function Drawer({ isOpen, onClose, children, title = "Drawer" }: DrawerProps) {
  if (!isOpen) return null

  return (
    // Overlay
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out"
      onClick={onClose} // Close on overlay click
    >
      {/* Drawer Content */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-black text-white p-6 border-t-4 border-l-0 border-r-0 border-b-0 border-[#00B6DD] shadow-[0_-8px_0px_rgba(0,182,221,0.5)] z-50 transition-transform duration-300 ease-in-out transform ${ /* Dark bg, white text, accent border/shadow */
          isOpen ? 'translate-y-0' : 'translate-y-full'
        } max-h-[75vh] flex flex-col`} // Limit height and enable flex column
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside drawer
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#00B6DD] flex-shrink-0"> {/* Accent border */}
          <h2 className="text-xl font-semibold text-[#00B6DD]">{title}</h2> {/* Accent title */}
          <Button
            onClick={onClose}
            buttonText="Close"
            color="gray" // Use a neutral color
            size="sm" // Smaller close button
            className="neo-button" // Apply NeoBrutalism style if desired
          />
        </div>

        {/* Scrollable Content Area */}
        <div className="overflow-y-auto flex-grow">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Drawer
