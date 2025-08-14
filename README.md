# 🏆 Questly - Gamified Productivity & Goal Management Platform

**Transform your daily tasks into epic quests with achievements, XP rewards, and streaks!**

Questly is a modern, gamified productivity platform that turns mundane tasks into engaging quests. Build habits, track progress, and level up your productivity with a beautiful, responsive interface and powerful quest management system.

![Questly Hero](.apps/web/public/ql_hr.png)

## ✨ Overview

Questly gamifies productivity by organizing your tasks into different quest types:

- **Daily Quests** - Recurring habits and routines (exercise, reading, meditation)
- **Side Quests** - One-time tasks and goals (finish project, call friend)
- **Main Quests** - Long-term objectives with sub-quests (learn a skill, plan a trip)

Each completed quest rewards you with XP points, builds your streak, and unlocks achievements. Track your progress with beautiful charts, maintain momentum with streaks, and stay motivated with a comprehensive achievement system.

## 🎮 Key Features

### 🎯 **Quest Management**

- **Daily Quest Templates** - Create recurring habits with priority levels
- **Side Quests** - Flexible one-time tasks with deadlines
- **Main Quests** - Complex goals broken down into manageable sub-quests
- **Task Subtasks** - Add detailed tasks within each quest
- **Smart Scheduling** - Automatic quest generation based on recurrence rules

### 🏅 **Gamification System**

- **XP & Leveling** - Earn experience points and level up your character
- **Achievement System** - Unlock rewards for completing milestones
- **Streak Tracking** - Build and maintain daily completion streaks
- **Priority-Based Rewards** - Higher priority quests give more XP
- **Progress Visualization** - Beautiful charts and progress rings

### 📊 **Analytics & Tracking**

- **Interactive Performance Charts** - Visual progress tracking with clickable data points
- **Quest Activity Grid** - Weekly completion status across all quests
- **Streak Analytics** - Monitor and analyze your consistency patterns
- **Completion Statistics** - Detailed breakdowns of your productivity metrics
- **Time-Period Flexibility** - View progress across daily, weekly, or custom ranges

### 🔧 **User Experience**

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Dark Theme** - Beautiful, eye-friendly dark interface
- **Smooth Animations** - Polished interactions with Framer Motion
- **Real-time Updates** - Instant feedback on quest completion
- **Timezone Support** - Accurate quest scheduling across timezones

### 🔐 **Authentication & Security**

- **Better Auth Integration** - Secure authentication with Google OAuth
- **Anonymous Mode** - Try the app without registration
- **Account Upgrade** - Convert anonymous accounts to full accounts
- **Session Management** - Secure, persistent login sessions

## 🛠️ Tech Stack

### **Frontend**

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations and transitions
- **Radix UI** - Accessible, unstyled components
- **React Query** - Server state management and caching
- **React Hook Form** - Form handling with validation

### **Backend**

- **Express.js** - Node.js web framework
- **Better Auth** - Modern authentication library
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - Reliable relational database
- **Node.js Cron** - Scheduled quest generation
- **JWT** - Secure token authentication

### **Infrastructure**

- **Docker** - Containerized deployment
- **PM2** - Process management
- **Nginx** - Reverse proxy and load balancing
- **DigitalOcean** - Cloud hosting
- **Turbo** - Monorepo build system
- **PNPM** - Fast, efficient package manager

## 🚀 Installation & Setup

### **Prerequisites**

- Node.js 18+
- PostgreSQL database
- PNPM package manager

### **1. Clone Repository**

```bash
git clone https://github.com/vinayak-00017/Questly.git
cd Questly
```

### **2. Install Dependencies**

```bash
pnpm install
```

### **3. Environment Setup**

Create environment files for development:

**`apps/api/.env`**

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/questly_dev"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters"
BETTER_AUTH_SECRET="another-super-secret-key-for-better-auth"
BETTER_AUTH_URL="http://localhost:5001"

# API Configuration
NODE_ENV="development"
PORT=5001
FRONTEND_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**`apps/web/.env.local`**

```bash
# API Connection
NEXT_PUBLIC_API_URL="http://localhost:5001/v1"
NEXT_PUBLIC_AUTH_URL="http://localhost:5001/v1/api/auth"

# Environment
NODE_ENV="development"
```

### **4. Database Setup**

```bash
# Generate database schema
pnpm db:generate

# Run migrations
pnpm db:migrate

# Seed with sample data (optional)
pnpm db:seed
```

### **5. Start Development Servers**

```bash
# Start both API and web servers
pnpm dev

# Or start individually:
# pnpm --filter api dev
# pnpm --filter web dev
```

The application will be available at:

- **Frontend**: http://localhost:3000
- **API**: http://localhost:5001

## 📱 Usage Guide

### **Getting Started**

1. **Sign Up** - Create an account or try anonymously
2. **Set Timezone** - Configure your timezone for accurate quest scheduling
3. **Create Daily Quests** - Set up recurring habits like "Exercise for 30 minutes"
4. **Add Side Quests** - Create one-time tasks with optional deadlines
5. **Build Main Quests** - Break down large goals into smaller sub-quests

### **Daily Workflow**

1. **Check Dashboard** - View today's quests and progress
2. **Complete Tasks** - Mark individual tasks within quests as done
3. **Finish Quests** - Complete entire quests to earn XP
4. **Track Progress** - Monitor your streaks and achievements
5. **Plan Tomorrow** - Add new quests or adjust existing ones

### **Quest Types**

**Daily Quests** 🔄

- Recurring habits that reset daily
- Automatically generated based on templates
- Priority levels: Low, Medium, High, Urgent
- Example: "Read for 20 minutes", "Drink 8 glasses of water"

**Side Quests** ⚡

- One-time tasks with optional deadlines
- Flexible completion timeframes
- Can be created on-demand
- Example: "Call mom", "Finish project report"

**Main Quests** 🎯

- Long-term goals with sub-quests
- Complex objectives broken into manageable parts
- Track overall progress across multiple related quests
- Example: "Learn Spanish" with sub-quests for lessons, practice, etc.

### **XP & Progression**

- **XP Calculation** - Based on quest priority and completion
- **Leveling System** - Accumulate XP to reach new levels
- **Streaks** - Maintain daily completion for bonus motivation
- **Achievements** - Unlock rewards for milestones and consistency

## 📁 Project Structure

```
questly/
├── 📱 apps/
│   ├── api/                          # Express.js API server
│   │   ├── lib/                      # Authentication & utilities
│   │   ├── services/                 # Business logic services
│   │   ├── src/
│   │   │   ├── controllers/          # Route controllers
│   │   │   ├── db/                   # Database schema & connection
│   │   │   ├── middleware/           # Express middleware
│   │   │   ├── routes/               # API routes
│   │   │   └── utils/                # Helper functions
│   │   └── drizzle/                  # Database migrations
│   └── web/                          # Next.js frontend
│       ├── app/                      # App Router pages
│       ├── components/               # React components
│       ├── contexts/                 # React contexts
│       ├── hooks/                    # Custom hooks
│       ├── lib/                      # Client utilities
│       └── services/                 # API service layer
├── 📦 packages/                      # Shared packages
│   ├── types/                        # Shared TypeScript types
│   ├── utils/                        # Shared utilities
│   ├── ui/                           # Shared UI components
│   ├── config-eslint/              # ESLint configurations
│   └── config-typescript/           # TypeScript configurations
├── 🚀 deployment/                    # Deployment & infrastructure
│   ├── docker/                      # Docker configurations
│   ├── scripts/                     # Deployment scripts
│   └── configs/                     # Service configurations
└── 📄 Configuration files           # Package.json, workspace config, etc.
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### **Development Process**

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper commit messages
4. **Add tests** for new functionality
5. **Run the test suite**: `pnpm test:all`
6. **Submit a pull request** with a clear description

### **Code Standards**

- **TypeScript** - All code must be properly typed
- **ESLint** - Follow the configured linting rules
- **Prettier** - Code must be formatted consistently
- **Testing** - Include unit tests for new features
- **Documentation** - Update docs for API changes

### **Commit Convention**

```bash
feat: add new quest analytics dashboard
fix: resolve streak calculation bug
docs: update API documentation
style: improve quest card animations
refactor: optimize database queries
test: add unit tests for XP calculation
```

## 🧪 Testing

```bash
# Run all tests
pnpm test:all

# Run unit tests only
pnpm test:unit

# Run integration tests
pnpm test:integration

# Run with coverage
pnpm test:coverage

# Type checking
pnpm type-check
```

## 📊 Performance

Questly is optimized for performance with:

- **Bundle Optimization** - 40% smaller bundles through code splitting
- **Database Efficiency** - 75% faster queries with optimized batching
- **React Query Caching** - 70% reduction in unnecessary API calls
- **Lightweight Charts** - Custom SVG charts replace heavy libraries
- **CSS Animations** - Hardware-accelerated animations for smoothness

## 🚀 Deployment

### **Production Environment**

1. **Environment Setup**

```bash
# Copy and configure production environment
cp .env.production.example .env.production
# Edit .env.production with your production values
```

2. **Build Application**

```bash
pnpm build
```

3. **Docker Deployment**

```bash
# Build and run with Docker
docker-compose -f deployment/docker/docker-compose.prod.yml up -d
```

4. **Manual Deployment**

```bash
# Deploy to DigitalOcean or similar
./deployment/scripts/deploy-digitalocean.sh
```

See [Deployment Guide](./deployment/docs/DEPLOYMENT.md) for detailed instructions.

## 📚 Documentation

- **[Project Structure](./PROJECT_STRUCTURE.md)** - Detailed code organization
- **[Environment Setup](./ENVIRONMENT_SETUP.md)** - Configuration guide
- **[Deployment Guide](./deployment/docs/DEPLOYMENT.md)** - Production setup
- **[Performance Optimizations](./FINAL_OPTIMIZATIONS_STATUS.md)** - Optimization details

## 🏗️ Architecture

- **Frontend**: Next.js 15 with TypeScript
- **Backend**: Express.js with Better Auth
- **Database**: PostgreSQL with Drizzle ORM
- **Deployment**: Docker with auto-restart policies
- **Monitoring**: Health checks, logging, alerts

## 📄 License

This project is licensed under the AGPL-3.0 license - see the [LICENSE](LICENSE) file for details.

## 📸 Screenshots

### Dashboard Overview

![Dashboard](./screenshots/dashboard.png)
_Main dashboard with today's quests, XP progress, and streak tracking_

### Quest Management

![Quest Management](./screenshots/quest-management.png)
_Create and manage daily, side, and main quests with task breakdowns_

### Progress Analytics

![Analytics](./screenshots/analytics.png)
_Beautiful charts and tracking for performance analysis_

### Mobile Experience

![Mobile](./screenshots/mobile.png)
_Fully responsive design works perfectly on mobile devices_

---

**Built with ❤️ by [Vinayak](https://github.com/vinayak-00017)**

_Transform your productivity journey into an epic adventure with Questly!_ 🎮✨

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
