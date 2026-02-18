<div align="center">
  <img src="public/logojansanklp.png" alt="JanSankalp AI Logo" width="180" />

# 🇮🇳 JanSankalp AI: Smart Urban Governance

### **Bridging the gap between Citizens and Authorities with AI-Driven Intelligence.**

[![Build & Build](https://github.com/abx15/JanSankalp-AI/actions/workflows/ci.yml/badge.svg)](https://github.com/abx15/JanSankalp-AI/actions/workflows/ci.yml)
[![Dockerized](https://img.shields.io/badge/Docker-Ready-blue?logo=docker)](file:///c:/Users/arunk/Desktop/ReactProjects25-26/JanSankalp%20AI/docker/docker-compose.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Documentation](https://img.shields.io/badge/Docs-Comprehensive-green)](docs/architecture.md)

---

[Overview](#-overview) • [Core Features](#-core-features) • [Tech Stack](#-tech-stack) • [System Flow](#-system-flow) • [Documentation](#-documentation) • [Getting Started](#-getting-started) • [Deployment](#-deployment)

</div>

---

## 🏗️ Overview

**JanSankalp AI** is a state-of-the-art civic grievance redressal platform. Unlike traditional systems that are buried in bureaucracy and language barriers, JanSankalp AI uses **multilingual Voice AI** and **Geo-spatial clustering** to streamline the resolution of municipal issues.

### Why JanSankalp?

- **Language Inclusivity**: Reporting issues in 18+ Indian languages via Voice AI.
- **Automated Triage**: No manual sorting; AI routes complaints to the correct department.
- **Transparency**: Every step is tracked in real-time on a community-driven map.

---

## 🚀 Core Features

### 🎙️ Multilingual Voice-First Reporting

Citizens can record their complaints in their mother tongue. Our pipeline transcribes (Whisper AI) and translates (GPT-4) the content instantly.

- **Accuracy**: 95%+ for major Indian dialects.
- **Automation**: Transcriptions are automatically summarized for the Quick-View dashboard.

### 🧠 AI-Powered Intelligence

Every complaint undergoes a deep analysis process:

- **Severity Scoring**: Quantifies the urgency (1-5) based on text context.
- **Category Detection**: Automatically tags issues (e.g., Road, Sanitation, Water).
- **Duplicate Detection**: Uses geo-spatial proximity and semantic similarity to prevent redundant case files.

### 📍 Geo-Spatial Governance

Interactive maps provide high-fidelity visibility:

- **Heatmaps**: Identifying systemic infrastructure failures.
- **Radius-Based Tracking**: Officers see issues within their assigned territory.
- **Status Markers**: Real-time color coding (Resolved: Green, Pending: Red, In-Progress: Amber).

### 👮 Officer & Admin Portals

- **Role-Based Workflows**: Dedicated dashboards for Field Officers and City Administrators.
- **Performance Analytics**: Track resolution efficiency by department.
- **PDF Reports**: One-click generation of official complaint receipts and closure reports.

---

## 🛠️ Tech Stack

| Layer              | Technologies                             |
| :----------------- | :--------------------------------------- |
| **Framework**      | Next.js 14 (App Router), TypeScript      |
| **Styling**        | Tailwind CSS, Framer Motion (Animations) |
| **Database**       | PostgreSQL, Prisma ORM                   |
| **Authentication** | NextAuth.js (v5 Beta)                    |
| **Real-time**      | Pusher (WebSockets)                      |
| **AI Services**    | OpenAI GPT-4o, OpenAI Whisper            |
| **Storage**        | Cloudinary / ImageKit                    |
| **Maps**           | Leaflet.js                               |

---

## 📂 System Architecture & Folder Structure

We follow a modular, scalable architecture:

```text
├── .github/          # CI/CD pipelines & open-source templates
├── config/           # Centralized project configuration
├── docs/             # Technical Deep-dives (Architecture, API, Setup)
├── docker/           # Production containerization (Multi-stage)
├── prisma/           # Database schemas, migrations, and seed scripts
├── public/           # Static assets (logos, images, fonts)
├── scripts/          # Automation tools (setup, build, clean)
└── src/
    ├── app/          # Next.js App Router (UI & API Routes)
    ├── components/   # Reusable Atomic UI units
    ├── lib/          # Core logic (AI, Notifications, PDF, Database)
    └── types/        # Global TypeScript interfaces
```

---

## 📘 Documentation Central

For detailed technical information, refer to the following guides:

| Document            | Description                                | Link                                 |
| :------------------ | :----------------------------------------- | :----------------------------------- |
| **Architecture**    | System design and data flow patterns.      | [View Docs](docs/architecture.md)    |
| **Environment**     | Required API keys and secrets.             | [View Docs](docs/environment.md)     |
| **Local Setup**     | Step-by-step developer installation.       | [View Docs](docs/setup.md)           |
| **Deployment**      | Vercel and Docker deployment instructions. | [View Docs](docs/deployment.md)      |
| **API Reference**   | Detailed list of REST endpoints.           | [View Docs](docs/api.md)             |
| **Troubleshooting** | Solutions for common setup issues.         | [View Docs](docs/troubleshooting.md) |

---

## 🚀 Getting Started

### 1. Zero-Install with Docker

The fastest way to get started is using our pre-configured Docker stack:

```bash
docker compose -f docker/docker-compose.yml up
```

### 2. Manual Installation

For active development, use our automation scripts:

```bash
# Clone and enter the repo
git clone https://github.com/abx15/JanSankalp-AI.git
cd JanSankalp-AI

# Run the automated setup (installs deps, generates prisma)
./scripts/setup.sh

# Start development server
./scripts/dev.sh
```

---

## 🤝 Contributing & Community

We believe in open-source for public good.

1. Review the [CONTRIBUTING.md](CONTRIBUTING.md).
2. Follow our [Conventional Commits](https://www.conventionalcommits.org/).
3. Be respectful in our [Code of Conduct](CODE_OF_CONDUCT.md).

---

## ⚖️ License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/abx15"><strong>Arun Kumar</strong></a></p>
  <p>For a Smarter, Faster, and More Transparent India. 🇮🇳</p>
</div>
