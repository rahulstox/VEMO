import { PrismaClient } from '@prisma/client'

declare global {
  var prisma: PrismaClient | undefined
}
// Create a Prisma Client instance (singleton)
export const client = globalThis.prisma || new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
// In development, store Prisma instance globally to prevent multiple connections
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = client
}



// 🔥 Why This is Better?
// Prevents multiple connections – Using globalThis.prisma ensures only one instance is created in development (important for Next.js due to hot-reloading).

// Improves debugging – The log option logs queries in development but keeps it minimal in production.

// Prepares for future scaling – It follows best practices for serverless environments, reducing unnecessary database connections.
