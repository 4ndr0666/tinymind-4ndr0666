<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs&style=for-the-badge" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-Production-blue?logo=typescript&style=for-the-badge" alt="TypeScript">
  <img src="https://img.shields.io/badge/GitHub-API-green?logo=github&style=for-the-badge" alt="GitHub API">
  <img src="https://img.shields.io/badge/Auth.js-v5-purple?style=for-the-badge" alt="Auth.js">
</p>

<h1 align="center">TinyMind-4ndr0666 // Sovereign Information Architecture 🧠.</h1>

<p align="center">
  <b>A decentralized, single-tenant document intelligence node.</b> <br>
  Sync your cognitive stream directly to an immutable, private GitHub-hosted vault.
</p>

<p align="center">
  <img src="public/Tinymind-banner.png" alt="Tinymind Banner" width="860">
</p>

---

## 🧭 Table of Contents

- [Architectural Flow](#-architectural-flow)
- [Deployment Prerequisites](#-deployment-prerequisites)
- [Environment Configuration](#-environment-configuration)
- [Data Storage Schema](#-data-storage-schema)
- [Client-Side Integration (Chrome)](#-client-side-integration-chrome)
- [Asset Generation](#-asset-generation)
- [Verification Checklist](#-verification-checklist)
- [Troubleshooting](#-troubleshooting)

---

## 🏗️ Architectural Flow

<p align="center">
  <img src="public/icon.png" alt="High-level Architecture" width="720">
</p>

1.  **Input Vector:** Chrome Extension or Web Editor captures text/image blobs.
2.  **Transport:** Secure transmission to Vercel-hosted API routes utilizing Next.js 16 asynchronous routing.
3.  **Authentication:** Auth.js (NextAuth v5) validates identity against the private GitHub instance.
4.  **Committal:** The API executes a repository commit (JSON/Markdown) directly to the storage node.
5.  **Rendering:** Client-side components ingest raw markdown, strip frontmatter safely, and perform AST-safe rendering.

---

## 🛠️ Deployment Prerequisites

### Hardware/Environment
- Node.js `v18.0.0+`
- Next.js `16.3.1`
- Vercel-compatible CI/CD environment
- GitHub account (Personal or Organization)

### Secrets Orchestration
Define the following variables within your deployment environment (e.g., Vercel Project Settings):

| Key | Purpose |
| :--- | :--- |
| `GITHUB_ID` | OAuth Client Identifier |
| `GITHUB_SECRET` | OAuth Client Secret |
| `NEXTAUTH_SECRET` | 32-Byte Salt/Hash Key |
| `NEXTAUTH_URL` | Production Canonical Domain |
| `GITHUB_TOKEN` | (Optional) PAT for high-speed public API execution |

---

## 🔒 Security & Authentication

TinyMind-4ndr0666 is a **Private Sovereign Node**. Unlike public instances, this architecture implements **Zero-Trust Access** for all core writing and configuration tasks. The application never stores credentials; it requests a transient access token (JWT) via OAuth2.

- **Scopes:** The system specifically requests `repo` and `workflow` scopes.
- **Privacy:** Data resides in a private repository; you retain 100% control over access lists.
- **API Integrity:** All internal routes (`/api/github/*`) utilize Auth.js v5 `auth()` checks. If the session cookie is invalidated, read/write operations fail instantly.

---

## 📦 Data Storage Schema

### Thoughts
Stored as a monolithic array in `content/thoughts.json`.
```json
{
  "id": "1779161512136",
  "content": "Raw markdown content...",
  "timestamp": "2026-05-19T03:31:52.136Z"
}

```

### Blog Posts

Stored as individual Markdown files in `content/blog/`.

* **Parsing:** Handled via custom utilities and `BlogPostContent.tsx`.
* **Frontmatter:** Strict, hardened YAML parsing utilizes `try/catch` fallbacks to strip quotes and gracefully handle malformed dates without throwing RangeErrors.
* **ID Generation:** URL-safe IDs are explicitly stripped of curly braces and non-alphanumeric punctuation to prevent directory traversal and routing hydration failures.

---

## 🧩 Client-Side Integration (Chrome)

The Chrome extension acts as an autonomous input agent, engineered to work seamlessly with Vercel's strict cookie security.

### Setup

1. Clone the extension repository.
2. Execute `npm install`.
3. Load the `tinymind-extension/` directory into Chrome (`chrome://extensions` → Load Unpacked).
4. **Environment Check:** Ensure the `API_BASE` and `SESSION_API` constants in `background/service-worker.js` match your production URL.

### Security & Cross-Origin Auth

The extension requires **no API keys** to be stored locally. To bypass Vercel's Host-Only cookie restrictions, the extension authenticates by sending a cross-origin `fetch` directly to the `/api/auth/session` endpoint with `credentials: 'include'`, forcing the browser to securely attach the `authjs.session-token`.

---

## 🎨 Asset Generation

To customize the branding of your Sovereign Node, use the included interactive Python script:

```bash
python3 mkicons.py

```

This utility performs LANCZOS resizing for square targets and center-crop-to-ratio resizing for banners to prevent distortion.

* **Safe Backups:** If an icon collision is detected, the script interactively prompts you to define a backup name (defaulting to `[name]_original.png`) before atomic replacement.

---

## ✅ Verification Checklist

* [ ] OAuth application registered with `repo` scope.
* [ ] Vercel environment variables fully populated.
* [ ] `content/thoughts.json` initialized as `[]` in the private repo.
* [ ] Chrome extension manifest `host_permissions` allow your explicit Vercel domain.
* [ ] Verified session persistence via NextAuth v5 `auth()`.

---

## 🛠️ Troubleshooting

| Symptom | Diagnosis | Remediation |
| --- | --- | --- |
| `500 Internal Server Error` | Sync access of Async Params | Ensure `params` and `searchParams` in `page.tsx` use `React.use()` or are awaited. |
| `Infinite Spinner on Load` | Hydration Mismatch (`id="undefined"`) | Ensure Client Components check `if (!id |
| `Extension Perpetual Login` | Host-Only Cookie Issue | Reload extension in Chrome to ensure the `/api/auth/session` fetch mechanism is active. |
| `Client-side exception` | Markdown AST crash | Wrap content in Markdown code blocks (```text). |
