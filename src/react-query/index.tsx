'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

type Props = { children: React.ReactNode }

const client = new QueryClient()

const ReactQueryProvider = ({ children }: Props) => {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}

export default ReactQueryProvider


// The ReactQueryProvider component wraps the application’s components (children) so they can use React Query seamlessly.
// QueryClientProvider is a context provider that allows any child components to use React Query features like:

// Fetching data (useQuery)

// Mutating data (useMutation)

// Automatic caching & re-fetching for better performance.