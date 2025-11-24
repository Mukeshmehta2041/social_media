module.exports = {
  apps: [
    {
      name: 'backend',
      cwd: './backend',
      script: 'npm',
      args: 'run start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 1337,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 1337,
      },
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
    {
      name: 'frontend',
      cwd: './frontend',
      script: 'npm',
      args: 'run preview',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 4173,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 4173,
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};

