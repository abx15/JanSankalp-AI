# Troubleshooting

## Installation Issues

### Prisma Generation Fails

If `npx prisma generate` fails, ensure you have the correct `binaryTargets` in `schema.prisma` if running in Docker. Try deleting `node_modules` and `npm install` again.

### Database Connection Refused

- Check if PostgreSQL is running locally (`pg_isready`).
- Verify the credentials in `DATABASE_URL`.
- Ensure your IP is whitelisted if using a hosted database like Neon or Supabase.

## Common NextAuth Errors

### "Invalid Callback URL"

Ensure `NEXTAUTH_URL` in `.env` matches your browser URL exactly (e.g., `http://localhost:3000`).

### Login Redirect Loop

Clear browser cookies for the domain and ensure `AUTH_SECRET` is set correctly.

## AI & Media Errors

### Voice Transcription Fails

- Verify `OPENAI_API_KEY` has active balance/quota.
- Check if the audio format is supported by Whisper.

### Images Not Showing

Ensure Cloudinary environment variables are correctly prefixed with `NEXT_PUBLIC_` where required for client-side usage.
