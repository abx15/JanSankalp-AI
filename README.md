# JanSankalp AI 🇮🇳

<p align="center">
  <img src="https://raw.githubusercontent.com/abx15/JanSankalp-AI/main/public/logo-placeholder.png" alt="JanSankalp AI Logo" width="200" />
</p>

<p align="center">
  <strong>"Har Awaaz, Har Shehar – Smart Governance with AI"</strong>
</p>

<p align="center">
  <a href="https://github.com/abx15/JanSankalp-AI/actions/workflows/nextjs.yml">
    <img src="https://github.com/abx15/JanSankalp-AI/actions/workflows/nextjs.yml/badge.svg" alt="CI Status" />
  </a>
  <a href="https://github.com/abx15/JanSankalp-AI/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/abx15/JanSankalp-AI" alt="License" />
  </a>
  <a href="https://github.com/abx15/JanSankalp-AI/stargazers">
    <img src="https://img.shields.io/github/stars/abx15/JanSankalp-AI" alt="Stars" />
  </a>
  <a href="https://github.com/abx15/JanSankalp-AI/network/members">
    <img src="https://img.shields.io/github/forks/abx15/JanSankalp-AI" alt="Forks" />
  </a>
</p>

---

## 🏗️ Overview

**JanSankalp AI** is a production-grade, AI-powered civic intelligence platform designed to bridge the gap between citizens and urban governance. It empowers citizens to report civic issues through voice, text, and images in their native languages, while providing authorities with real-time, AI-prioritized data for efficient resolution.

The platform uses cutting-edge AI for **multilingual transcription**, **automated severity scoring**, and **duplicate detection**, making it a state-of-the-art solution for modern Indian cities.

---

## 🚀 Key Features

### 👤 Citizen Empowerment

- **Advanced Animated Reporting**: A premium, 3-step reporting flow powered by **Framer Motion**.
- **AI Voice Reporting**: Hands-free reporting via **OpenAI Whisper**. Talk in any language; the AI handles transcription.
- **Multilingual Support**: Real-time translation and language detection for 22+ Indian languages.
- **Geo-Intelligent Tagging**: Automatic GPS detection and interactive maps using **Leaflet**.

### 👮 Governance Intelligence

- **AI Triage Engine**: Reports are automatically classified by category and urgency (1-5 scale).
- **Duplicate Suppression**: Smart clustering logic prevents officers from seeing redundant reports for the same location.
- **Real-time Analytics**: Live dashboards for administrators using **Pusher** and interactive charts via **Recharts**.

### 🛠️ Developer-First Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) with [Prisma ORM](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **AI**: [OpenAI GPT-4 & Whisper](https://openai.com/)
- **Real-time**: [Pusher](https://pusher.com/)
- **Cloud Storage**: [Cloudinary](https://cloudinary.com/)

---

## 🛤️ The JanSankalp Process

We've visualized the journey from a citizen's voice to a city's resolution:

1.  **Report**: Citizen triggers a report via voice or text.
2.  **Triage**: AI Engine translates and scores the report for urgency.
3.  **Process**: Officers receive the report on a real-time prioritized dashboard.
4.  **Resolve**: Progress is tracked, and the citizen receives a digital receipt upon completion.

---

## 🛠️ Installation & Setup

### Prerequisites

- Node.js 18+
- PostgreSQL Database
- OpenAI API Key
- Cloudinary & Pusher accounts

### Setup Steps

1. **Clone & Install**

   ```bash
   git clone https://github.com/abx15/JanSankalp-AI.git
   cd JanSankalp-AI
   npm install --legacy-peer-deps
   ```

2. **Environment Configuration**
   Create a `.env` file:

   ```env
   DATABASE_URL="your_postgresql_url"
   OPENAI_API_KEY="your_openai_key"
   CLOUDINARY_CLOUD_NAME="your_name"
   CLOUDINARY_API_KEY="your_key"
   CLOUDINARY_API_SECRET="your_secret"
   NEXT_PUBLIC_PUSHER_KEY="your_pusher_key"
   PUSHER_SECRET="your_pusher_secret"
   NEXT_PUBLIC_PUSHER_CLUSTER="your_cluster"
   ```

3. **Database & Seed**

   ```bash
   npx prisma db push
   npx prisma db seed
   ```

4. **Launch**
   ```bash
   npm run dev
   ```

---

## 👨‍💻 Developer & Connect

Developed with ❤️ by **abx15**.

Feel free to connect or reach out for collaborations:

- **GitHub**: [@abx15](https://github.com/abx15)
- **LinkedIn**: [Arun Kumar Bind](https://www.linkedin.com/in/arun-kumar-a3b047353/)
- **Email**: [developerarunwork@gmail.com](mailto:[developerarunwork@gmail.com])

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**. Please read our [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built for a Smarter India. 🇮🇳
</p>
