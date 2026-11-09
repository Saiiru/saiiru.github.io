// Build deterministically even when the developer's shell exports NODE_ENV=development.
process.env.NODE_ENV = 'production'
await import('./sync-labs.mjs')
const { build } = await import('vite')
await build({ mode: 'production' })
