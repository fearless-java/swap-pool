# sushiswap-clone

Generated with [create-vandslab-app](https://github.com/vandslab/create-vandslab-app)

## Project Structure

```
apps/
├── web/          # Frontend application
├── backend/      # Backend server
packages/         # Shared configurations
turbo.json        # Turborepo config
```

## Stack

- **Monorepo**: Turborepo
- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS
- **Backend**: Express + TypeScript
- **Database**: PostgreSQL with Prisma
- **Auth**: JWT Authentication
- **API Docs**: Swagger/OpenAPI

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development servers
pnpm dev

# Type check all packages
pnpm typecheck

# Build all packages
pnpm build

# Start production servers
pnpm start
```

## Available Scripts

- **`pnpm dev`**: Start all development servers
- **`pnpm build`**: Build all packages for production
- **`pnpm start`**: Start all production servers
- **`pnpm typecheck`**: Type check all packages
- **`pnpm lint`**: Lint all packages
- **`pnpm test`**: Run tests in all packages
- **`pnpm clean`**: Clean all build outputs
