module.exports = {
  apps: [
    {
      name: 'questly-api',
      script: './apps/api/dist/index.js',
      cwd: '/var/www/questly',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 5000,
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      },
      error_file: '/var/log/pm2/questly-api-error.log',
      out_file: '/var/log/pm2/questly-api-out.log',
      log_file: '/var/log/pm2/questly-api-combined.log',
      time: true
    },
    {
      name: 'questly-web',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/questly/apps/web',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 5000,
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOSTNAME: '0.0.0.0'
      },
      error_file: '/var/log/pm2/questly-web-error.log',
      out_file: '/var/log/pm2/questly-web-out.log',
      log_file: '/var/log/pm2/questly-web-combined.log',
      time: true
    }
  ]
};
