module.exports = {
  apps: [{
    name: 'gmeports-quiz',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/gmeports-quiz',
    exec_mode: 'fork', // FORK mode (não cluster)
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3040
    },
    error_file: '/var/www/gmeports-quiz/logs/err.log',
    out_file: '/var/www/gmeports-quiz/logs/out.log',
    log_file: '/var/www/gmeports-quiz/logs/combined.log',
    time: true
  }]
}
