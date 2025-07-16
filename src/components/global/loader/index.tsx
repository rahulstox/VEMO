import React from 'react'
import { Spinner } from './spinner' // ✅ Import the Spinner component (assumed to show a loading animation)
import { cn } from '@/lib/utils' // ✅ Import a utility function for merging class names

// ✅ Define the props for the Loader component
type Props = {
  state: boolean // ✅ Determines whether to show the spinner or content
  className?: string // ✅ Optional class for custom styling
  color?: string // ❌ This prop is not used in the component
  children?: React.ReactNode // ✅ Elements to display when state is false
}

// ✅ Loader component: Displays a spinner while loading, otherwise renders children
const Loader = ({ state, className, color, children }: Props) => {
  return state ? ( // ✅ If 'state' is true, show the spinner
    <div className={cn(className)}> {/* ✅ Apply optional class names */}
      <Spinner /> {/* ✅ Render the spinner component */}
    </div>
  ) : (
    children // ✅ If 'state' is false, render the provided children
  )
}

export default Loader
