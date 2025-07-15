# 📁 Questly Project Structure

```
questly/
├── 📱 apps/                          # Applications
│   ├── api/                          # Express.js API server
│   └── web/                          # Next.js frontend
├── 📦 packages/                      # Shared packages
│   ├── config-eslint/               # ESLint configurations
│   ├── config-typescript/           # TypeScript configurations
│   ├── jest-presets/                # Jest test configurations
│   ├── logger/                      # Logging utilities
│   ├── types/                       # Shared TypeScript types
│   ├── ui/                          # Shared UI components
│   └── utils/                       # Shared utilities
├── 🚀 deployment/                   # Deployment & Infrastructure
│   ├── docker/                      # Docker configurations
│   │   ├── Dockerfile.digitalocean  # Production Dockerfile
│   │   ├── Dockerfile.pm2           # PM2-enabled Dockerfile
│   │   └── docker-compose.prod.yml  # Production compose file
│   ├── scripts/                     # Deployment & maintenance scripts
│   │   ├── backup-database.sh       # Database backup automation
│   │   ├── deploy-digitalocean.sh   # Deployment script
│   │   ├── health-check.sh          # Service health monitoring
│   │   ├── monitor.sh               # Comprehensive monitoring
│   │   ├── setup-droplet.sh         # Server setup script
│   │   ├── crontab-template          # Cron job templates
│   │   └── logrotate-questly        # Log rotation config
│   ├── configs/                     # Service configurations
│   │   ├── nginx.conf               # Nginx reverse proxy config
│   │   ├── postgresql.conf          # PostgreSQL security config
│   │   ├── pg_hba.conf              # PostgreSQL auth config
│   │   ├── ecosystem.config.js      # PM2 process config
│   │   └── init-scripts/            # Database initialization
│   └── docs/                        # Deployment documentation
│       ├── DEPLOYMENT.md            # Deployment guide
│       ├── PRODUCTION_DEPLOYMENT.md # Production setup guide
│       └── BUILD-FIXES-SUMMARY.md   # Build fixes documentation
├── 🔧 .github/                      # GitHub configurations
│   ├── workflows/                   # CI/CD pipelines
│   │   ├── deploy.yml               # Deployment automation
│   │   ├── test.yml                 # Testing pipeline
│   │   └── quality.yml              # Code quality checks
│   └── DEPLOYMENT.md                # GitHub-specific deployment docs
├── 📄 Configuration Files
│   ├── package.json                 # Root package configuration
│   ├── pnpm-workspace.yaml          # PNPM workspace setup
│   ├── turbo.json                   # Turbo monorepo config
│   ├── pnpm-lock.yaml              # Dependency lock file
│   └── README.md                    # Project documentation
└── 📊 Data Files
    └── yearly_data.json             # Application data
```

## 🎯 Key Organizational Benefits

### **🔍 Clear Separation of Concerns**

- **`apps/`** - Application code only
- **`packages/`** - Reusable shared code
- **`deployment/`** - All infrastructure & ops
- **`.github/`** - CI/CD & GitHub-specific configs

### **🚀 Deployment Structure**

- **`docker/`** - All Docker-related files
- **`scripts/`** - Automation & maintenance
- **`configs/`** - Service configurations
- **`docs/`** - Deployment documentation

### **📦 Easy Navigation**

- Related files are grouped together
- Clear naming conventions
- Logical hierarchy for quick access

### **🔧 Development Benefits**

- Easier to onboard new developers
- Clear where to find specific configurations
- Deployment files don't clutter main directory
- Better IDE navigation and search
