# 🏆 Questly - Quest Tracking & Achievement System

A modern, gamified productivity platform built with Next.js, Express.js, and PostgreSQL.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/vinayak-00017/questly.git
cd questly

# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Build for production
pnpm build

# Deploy to production
./deployment/scripts/quick-deploy.sh
```

## 📁 Project Structure

See [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) for detailed organization.

```
questly/
├── 📱 apps/           # Applications (API & Web)
├── 📦 packages/       # Shared packages & utilities
├── 🚀 deployment/     # Docker, scripts, configs & docs
├── 🔧 .github/        # CI/CD workflows
└── 📄 Config files    # Package.json, workspace setup
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- PNPM
- Docker & Docker Compose (for production)

### Commands

- `pnpm dev` - Start development servers
- `pnpm build` - Build all applications
- `pnpm test` - Run test suites
- `pnpm lint` - Lint code
- `pnpm type-check` - TypeScript validation

## 🚀 Deployment

### Quick Local Production

```bash
./deployment/scripts/quick-deploy.sh
```

### DigitalOcean Production

1. Set up GitHub secrets (see `.github/DEPLOYMENT.md`)
2. Push to `main` branch - automatic deployment via GitHub Actions

### Manual Production Setup

See `deployment/docs/PRODUCTION_DEPLOYMENT.md` for detailed instructions.

## 🏗️ Architecture

- **Frontend**: Next.js 15 with TypeScript
- **Backend**: Express.js with Better Auth
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Docker with auto-restart policies
- **Monitoring**: Health checks, logging, alerts

## 📚 Documentation

- [Project Structure](./PROJECT_STRUCTURE.md) - Code organization
- [Deployment Guide](./deployment/docs/DEPLOYMENT.md) - Production setup
- [Build Fixes](./deployment/docs/BUILD-FIXES-SUMMARY.md) - Common issues

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm test`
5. Submit a pull request

## 🧪 Local Testing

Before deploying to production, test everything locally:

```bash
# Test development setup
pnpm dev

# Test production build
pnpm build

# Test local production deployment
./deployment/scripts/quick-deploy.sh

# Run comprehensive tests
pnpm test:all

# Check service health
./deployment/scripts/status.sh
```

## 🔧 Utilities

This Turborepo includes:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Jest](https://jestjs.io) test runner for all things JavaScript
- [Prettier](https://prettier.io) for code formatting
- [Turbo](https://turbo.build/) for efficient monorepo builds
