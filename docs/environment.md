# Environment Variables

## Required Variables

| Variable         | Description                      | Example                               |
| :--------------- | :------------------------------- | :------------------------------------ |
| `DATABASE_URL`   | PostgreSQL connection string     | `postgresql://user:pass@host:5432/db` |
| `AUTH_SECRET`    | Secret for NextAuth.js           | `openssl rand -base64 32`             |
| `NEXTAUTH_URL`   | Base URL for authentication      | `http://localhost:3000`               |
| `OPENAI_API_KEY` | Key for Voice/Text AI processing | `sk-...`                              |

## Third-Party Integrations

### Pusher (Real-time)

- `NEXT_PUBLIC_PUSHER_KEY`
- `NEXT_PUBLIC_PUSHER_CLUSTER`
- `PUSHER_SECRET`
- `NEXT_PUBLIC_PUSHER_APP_ID`

### Cloudinary (Media)

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

### Email (Resend)

- `RESEND_API_KEY`

## Development Settings

- `ADMIN_PASSWORD`: Default password for seeded admin.
- `OFFICER_PASSWORD`: Default password for seeded officers.
