module.exports = {
  apps: [
    {
      name: 'pamliecoconnect-api',
      script: 'artifacts/api-server/dist/index.mjs',
      cwd: '/home/ca12a15/sites/sailhatteras_site',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        DATABASE_URL: 'postgresql://sailhatteras_app:gYi4HQwQqpE40bEyWkzvhDhw@127.0.0.1:5432/sailhatteras',
        TELEGRAM_BOT_TOKEN: 'process.env.TELEGRAM_BOT_TOKEN',
        TELEGRAM_CHAT_ID: '8592364489',
        TELEGRAM_WEBHOOK_URL: 'https://pamliecoconnect.com',
        SMTP_HOST: 'mail.sailhatteras.org',
        SMTP_PORT: '587',
        SMTP_USER: 'info@sailhatteras.org',
        SMTP_PASS: 'BunnySails2019',
        ADMIN_EMAIL: 'jay.phillips@phillipsboatworks.com',
        STORAGE_TYPE: 'local',
        LOCAL_UPLOAD_DIR: '/home/ca12a15/sites/sailhatteras_site/uploads',
        SESSION_SECRET: 'process.env.SESSION_SECRET'
      }
    },
    {
      name: 'pamliecoconnect-website',
      script: 'artifacts/website/prod-server.mjs',
      cwd: '/home/ca12a15/sites/sailhatteras_site',
      env: {
        PORT: 8081
      }
    }
  ]
};
