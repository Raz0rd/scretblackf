module.exports = {
  apps: [{
    name: 'buxfire',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/buxfire',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3030
    }
  }]
}
