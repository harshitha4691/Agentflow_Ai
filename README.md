# 🚀 Agentflow_AI — Core Architecture Foundation

An operator-focused workflow automation workspace designed to translate natural-language prompts into visual, executable backend pipelines. This repository contains the foundational web server infrastructure, application security layer, and cryptographic utilities built strictly using **Spec-Driven Development (SDD)** paradigms.

---

## ✨ Currently Implemented Architecture

This initial phase establishes the core runtime configuration, security configurations, and cryptographic standards needed to process sensitive third-party tokens securely at a Tier-1 engineering level.

### 🛡️ Core Highlights
* **Cryptographic Token Isolation:** Implemented an enterprise-grade `crypto.js` wrapper utilizing **AES-256-GCM** authenticated encryption to safely secure external user credentials (OAuth keys) at rest.
* **Hardened API Gateway:** Initialized `app.js` with critical security headers via `helmet`, automated network payload optimization using `compression`, and isolated system logging using `morgan`.
* **Decoupled Controller Routes:** Created routing trees for `workflows`, `executions`, and `integrations` to strictly enforce separation of concerns.

---

## 🛠️ Tech Stack (Current Baseline)

| Layer | Component | Responsibility |
| :--- | :--- | :--- |
| **Runtime Engine** | Node.js (v24 Native) | Core platform execution substrate |
| **Server Framework** | Express.js | Route routing and middleware gateway |
| **Security Layer** | Helmet / Crypto | Security header hardening & AES-256 token encryption |
| **Performance** | Compression | Gzip-deflate network payload optimizations |

---

## 📁 Project Workspace Layout

The active layout footprint matches your current development tree structure:

```text
agentflow-ai/
└── server/
    ├── src/
    │   ├── routes/
    │   │   ├── executionRoutes.js    # Workflow execution pipelines (Stub)
    │   │   ├── integrationRoutes.js  # OAuth third-party connectors (Stub)
    │   │   └── workflowRoutes.js     # Visual graph configuration endpoints (Stub)
    │   ├── services/
    │   │   ├── aiService.js          # Core LLM processing engine boundary
    │   │   └── authService.js        # Session identity manager
    │   ├── utils/
    │   │   └── crypto.js             # AES-256-GCM hardware encryption utility
    │   └── app.js                    # Primary Express application engine mount
    ├── .env                          # Local service secrets config
    ├── package.json
    └── package-lock.json
