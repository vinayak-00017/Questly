module.exports = {
  apps: [
    {
      name: "questly-api",
      script: "./apps/api/dist/index.js",
      cwd: "/app",
      instances: "max", // Use all CPU cores
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      // PM2 specific configurations
      max_memory_restart: "1G",
      node_args: "--max-old-space-size=1024",
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,

      // Auto-restart policies
      autorestart: true,
      max_restarts: 5,
      min_uptime: "10s",

      // Logging
      log_file: "/var/log/questly/api-combined.log",
      out_file: "/var/log/questly/api-out.log",
      error_file: "/var/log/questly/api-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,

      // Monitoring
      pmx: true,
      monitoring: true,

      // Health check endpoint
      health_check_grace_period: 3000,
    },
    {
      name: "questly-web",
      script: "./apps/web/server.js",
      cwd: "/app",
      instances: 2, // Next.js doesn't benefit from too many instances
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },

      // PM2 specific configurations
      max_memory_restart: "512M",
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,

      // Auto-restart policies
      autorestart: true,
      max_restarts: 5,
      min_uptime: "10s",

      // Logging
      log_file: "/var/log/questly/web-combined.log",
      out_file: "/var/log/questly/web-out.log",
      error_file: "/var/log/questly/web-error.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,

      // Monitoring
      pmx: true,
      monitoring: true,
    },
  ],

  deploy: {
    production: {
      user: "root",
      host: process.env.DO_HOST,
      ref: "origin/main",
      repo: "git@github.com:vinayak-00017/questly.git",
      path: "/var/www/questly",
      "pre-deploy-local": "",
      "post-deploy":
        "pnpm install && pnpm build && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
