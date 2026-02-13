# JanSankalp AI 🇮🇳

### "Har Awaaz, Har Shehar – Smart Governance with AI"

JanSankalp AI is a production-grade, AI-powered civic intelligence platform designed to bridge the gap between citizens and urban governance. It empowers citizens to report civic issues through voice, text, and images in their native languages, while providing authorities with real-time, AI-prioritized data for efficient resolution.

---

## 🚀 Key Features

### 👤 Citizen Empowerment

- **Multi-Step Animated Reporting**: A seamless, intuitive 3-step reporting process.
- **AI Voice Transcription**: Report issues hands-free using the **Whisper API**. Speak in any language, and the AI will transcribe it effortlessly.
- **Multilingual Support**: Automatic language detection and translation (English/Regional) using **GPT-4**.
- **Visual Proof**: Integrated **Cloudinary** for image uploads to provide visual evidence.
- **Map Integration**: Precise geo-tagging using **Leaflet** with automatic GPS detection.

### 👮 Governance Intelligence (Officer/Admin)

- **Real-Time Dashboard**: Instant updates via **Pusher** for newly reported issues.
- **AI Severity Scoring**: Automated prioritization (1-5) based on sentiment, urgency keywords, and duplicate density.
- **Duplicate Detection**: Smart geo-fencing logic to identify similar reports within 200m.
- **Interactive Analytics**: Rich data visualization using **Recharts** for department performance and trend analysis.

### ✨ Advanced Capabilities

- **Digital Receipts**: Automated PDF generation for complaint tracking using **jsPDF**.
- **Gamification**: Civic Points and Leaderboard system to reward active contributors.
- **Dark Mode & PWA**: Mobile-first design with professional theme management.

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Radix UI.
- **Backend**: Next.js Server Actions, Prisma ORM, PostgreSQL.
- **Intelligence**: OpenAI (GPT-4 Turbo, Whisper), jspdf-autotable.
- **Real-time**: Pusher.js.
- **Storage**: Cloudinary.
- **Authentication**: Auth.js (NextAuth v5).

---

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-repo/jansankalp-ai.git
cd jansankalp-ai
```

### 2. Install Dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Environment Setup

Create a `.env` file in the root directory and add your credentials:

```env
# Database
DATABASE_URL="your_postgresql_url"

# AI Integration
OPENAI_API_KEY="your_openai_key"

# Storage
CLOUDINARY_CLOUD_NAME="your_name"
CLOUDINARY_API_KEY="your_key"
CLOUDINARY_API_SECRET="your_secret"

# Realtime
NEXT_PUBLIC_PUSHER_KEY="your_pusher_key"
PUSHER_SECRET="your_pusher_secret"
NEXT_PUBLIC_PUSHER_CLUSTER="your_cluster"
```

### 4. Database Setup

```bash
npx prisma db push
npx prisma db seed # Seeds initial departments and users
```

### 5. Run the Project

```bash
npm run dev
```

---

## 🎨 Design System

The platform follows a **Premium Governance Theme**:

- **Primary**: Deep Blue (#1E3A8A) - Symbolizing Trust & Stability.
- **Accent**: Vibrant Saffron (#F97316) - Symbolizing Energy & Growth.
- **Typography**: Inter / Outfit for a modern, state-of-the-art look.

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

Developed with ❤️ for a Smarter India.
