"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [isMounted, setIsMounted] = React.useState(false)

  // This useEffect only runs on the client, after the component has mounted
  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  // Until the component is mounted, we'll render nothing to avoid a mismatch
  if (!isMounted) {
    return null
  }

  // Once mounted, we can safely render the real provider
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}