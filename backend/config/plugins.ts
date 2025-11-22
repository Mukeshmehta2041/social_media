export default ({ env }) => ({
  'users-permissions': {
    enabled: true,
    config: {
      jwtSecret: env('JWT_SECRET'),
    },
  },
  upload: {
    config: {
      providerOptions: {
        localServer: {
          maxage: 300000,
        },
      },
      sizeLimit: env.int('MAX_FILE_SIZE', 5242880), // 5MB
    },
  },
  email: env('SMTP_USERNAME') ? {
    config: {
      provider: 'nodemailer',
      providerOptions: {
        host: env('SMTP_HOST', 'smtp.gmail.com'),
        port: env.int('SMTP_PORT', 587),
        auth: {
          user: env('SMTP_USERNAME'),
          pass: env('SMTP_PASSWORD'),
        },
      },
      settings: {
        defaultFrom: env('SMTP_USERNAME', 'noreply@example.com'),
        defaultReplyTo: env('SMTP_USERNAME', 'noreply@example.com'),
      },
    },
  } : {},
});
