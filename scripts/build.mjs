// Build deterministically even when the developer's shell exports NODE_ENV=development.
process.env.NODE_ENV = 'production'
const { build } = await import('vite')
await build({ mode: 'production' })
