<div align="center">

  <img src="public/logojansanklp.png" alt="JanSankalp AI Logo" width="200" />

# JanSankalp AI 🇮🇳

### **Har Awaaz, Har Shehar – Smart Governance for a Smarter India**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT4-412991?style=for-the-badge&logo=openai)](https://openai.com/)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Visit_Site-green?style=for-the-badge&logo=vercel)](https://jansanklpai.vercel.app/)

  <p align="center">
    <a href="#-overview">Overview</a> •
    <a href="#-key-features">Features</a> •
    <a href="#-how-it-works">How It Works</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-api-documentation">API Documentation</a> •
    <a href="#-installation">Installation</a> •
    <a href="#-license">License</a>
  </p>
</div>

---

## 🏗️ Overview

**JanSankalp AI** is a next-generation civic intelligence platform designed to bridge the gap between citizens and urban governance in India. By leveraging advanced Artificial Intelligence, we empower citizens to report issues in their native languages while providing authorities with real-time, actionable insights.

> **Problem**: Traditional grievance redressal systems are slow, manual, and often inaccessible to non-English speakers.
>
> **Solution**: JanSankalp AI uses **Voice AI**, **Geo-Spatial Analytics**, and **Automated Routing** to solve civic problems 10x faster.

---

## 🚀 Key Features

### 🗣️ **Multilingual Voice AI**

- **Speak in your language**: Support for **Hindi, English, Tamil, Telugu**, and 18+ other Indian languages.
- **Auto-Transcription**: Powered by OpenAI Whisper for 95%+ accuracy.
- **Real-time Translation**: Officers see complaints in English/Hindi regardless of source language.

### 🧠 **Smart Classification & Routing**

- **AI Triage**: Automatically categorizes complaints (Roads, Water, Electricity) using GPT-4.
- **Severity Scoring**: Assigns priority (Low, Medium, High, Critical) based on analysis.
- **Duplicate Detection**: Geo-spatial clustering identifies and groups similar complaints to prevent redundant work.

### 📍 **Geo-Spatial Intelligence**

- **Interactive Maps**: Heatmaps showing problem hotspots.
- **Location Auto-Tagging**: GPS integration for precise issue localization.
- **Officer Tracking**: Real-time field force management.

### 📱 **Citizen-First Experience**

- **WhatsApp Integration**: Easy reporting via familiar chat interfaces.
- **Live Status Tracking**: SMS and Email notifications at every step.
- **Digital Locker**: Secure storage for proofs and documents.

---

## 🔄 How It Works

We've simplified the complex process of governance into 4 automated steps:

1.  **Report**: Citizen speaks or types the issue (e.g., "Pothole on Main Road").
2.  **Process**: AI translates, classifies, and checks for duplicates.
3.  **Resolve**: The relevant department officer receives a prioritized alert.
4.  **Verify**: Citizen gets photo proof of resolution and rates the service.

---

## 🛠️ Tech Stack

| Component     | Technology                                        |
| :------------ | :------------------------------------------------ |
| **Frontend**  | Next.js 14, React, Framer Motion, Tailwind CSS    |
| **Backend**   | Next.js API Routes, Prisma ORM                    |
| **Database**  | PostgreSQL (Supabase/Neon)                        |
| **AI Engine** | OpenAI GPT-4, Whisper, TensorFlow (Custom Models) |
| **Real-time** | Pusher / Socket.io                                |
| **Maps**      | Leaflet / Mapbox                                  |
| **Auth**      | NextAuth.js                                       |

---

## � API Documentation

Our comprehensive API documentation provides everything developers need to integrate with JanSankalp AI:

### 🔗 **Quick Links**
- **[📘 API Reference](docs/API_DOCUMENTATION.md)** - Complete REST API documentation with endpoints, authentication, and examples
- **[🏗️ Architecture Guide](docs/ARCHITECTURE.md)** - System architecture, tech stack, and design patterns
- **[🗄️ Database Schema](docs/DATABASE_SCHEMA.md)** - Complete database structure and relationships
- **[🚀 Setup Guide](docs/SETUP_GUIDE.md)** - Step-by-step development environment setup
- **[🔒 Security Guidelines](docs/SECURITY_GUIDELINES.md)** - Security best practices and guidelines
- **[📦 Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Production deployment instructions

### 🚀 **Getting Started with the API**

1. **Authentication**: All API endpoints use JWT Bearer tokens
2. **Base URL**: `http://localhost:3000/api` (development) or `https://jansanklpai.vercel.app/api` (production)
3. **Content-Type**: `application/json` for all requests
4. **Rate Limiting**: Implemented for production environments

### 📖 **Key API Endpoints**
- **Authentication**: `/api/auth/*` - User authentication and session management
- **Complaints**: `/api/complaints/*` - CRUD operations for civic complaints
- **AI Processing**: `/api/ai/*` - AI-powered classification and analysis
- **Departments**: `/api/departments/*` - Municipal department management
- **Users**: `/api/user/*` - User profile and management

> **💡 Tip**: Check the complete [API Documentation](docs/API_DOCUMENTATION.md) for detailed request/response examples, error codes, and advanced features.

---

## �� Installation

Follow these steps to set up the project locally:

### Prerequisites

- Node.js 18+
- PostgreSQL Database
- OpenAI API Key

### Steps

1.  **Clone the repository**

    ```bash
    git clone https://github.com/abx15/JanSankalp-AI.git
    cd JanSankalp-AI
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/jansankalp"
    OPENAI_API_KEY="sk-..."
    NEXTAUTH_SECRET="your-secret"
    NEXT_PUBLIC_PUSHER_KEY="..."
    ```

4.  **Initialize Database**

    ```bash
    npx prisma generate
    npx prisma db push
    ```

5.  **Run Development Server**
    ```bash
    npm run dev
    ```

Visit `http://localhost:3000` to see the app in action! 🚀

---

## 🤝 Contributing

We welcome contributions! Please feel free to check out the [issues](https://github.com/abx15/JanSankalp-AI/issues) or submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">
  <p>Made with ❤️ for India 🇮🇳</p>
  <p>Built by <a href="https://github.com/abx15"><strong>Arun Kumar</strong></a></p>
</div>
