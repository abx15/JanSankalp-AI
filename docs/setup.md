# Local Development Setup

## Prerequisites

- **Node.js**: 18.x or higher
- **PostgreSQL**: 14+ (Local or Hosted)
- **Git**

## Quick Start (Automated)

Run the included setup script from the root:

```bash
./scripts/setup.sh
```

## Manual Setup

1. **Install Dependencies**:

   ```bash
   npm install
   ```

2. **Environment Configuration**:

   ```bash
   cp .env.example .env
   ```

   _Edit `.env` and provide your secrets._

3. **Database Initialization**:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Seed Data**:

   ```bash
   npm run seed
   ```

5. **Run Development Server**:
   ```bash
   npm run dev
   ```

## Local Docker Setup

One command and you're ready:

```bash
docker compose -f docker/docker-compose.yml up
```
