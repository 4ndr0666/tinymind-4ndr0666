<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=nextdotjs&style=for-the-badge" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-Production-blue?logo=typescript&style=for-the-badge" alt="TypeScript">
  <img src="https://img.shields.io/badge/GitHub-API-green?logo=github&style=for-the-badge" alt="GitHub API">
  <img src="https://img.shields.io/badge/License-MIT-purple?style=for-the-badge" alt="License">
</p>

<h1 align="center">TinyMind // Sovereign Information Architecture 🧠.</h1>

<p align="center">
  <b>A decentralized document intelligence node.</b> <br>
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
- [Distribution Models](#-distribution-models)
- [Verification Checklist](#-verification-checklist)
- [Troubleshooting](#-troubleshooting)

---

## 🏗️ Architectural Flow

<p align="center">
  <img src="public/icon.png" alt="High-level Architecture" width="720">
</p>

1.  **Input Vector:** Chrome Extension or Web Editor captures text/image blobs.
2.  **Transport:** Secure transmission to Vercel-hosted API routes.
3.  **Authentication:** NextAuth validates identity against the private GitHub instance.
4.  **Committal:** The API executes a repository commit (JSON/Markdown) directly to the storage node.
5.  **Rendering:** Client-side components ingest raw markdown and perform AST-safe rendering.

---

## 🛠️ Deployment Prerequisites

### Hardware/Environment
- Node.js `v18.0.0+`
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

---

## 🔒 Security & Authentication

TinyMind implements **Zero-Trust Access**. The application never stores credentials; it requests a transient access token (JWT) via OAuth2.

- **Scopes:** The system specifically requests `repo` and `workflow` scopes.
- **Privacy:** Data resides in a private repository; you retain 100% control over access lists.
- **API Integrity:** All internal routes (`/api/github/*`) utilize `getServerSession` checks. If the session cookie is invalidated, read/write operations fail instantly.

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

* **Parsing:** Handled via `MarkdownRenderer.tsx`.
* **Frontmatter:** Supports standard Markdown frontmatter for post metadata.

---

## 🧩 Client-Side Integration (Chrome)

The Chrome extension acts as an autonomous input agent.

### Setup

1. Clone the extension repository.
2. Execute `npm install`.
3. Load the `tinymind-extension/` directory into Chrome (`chrome://extensions` → Load Unpacked).
4. **Environment Check:** Ensure the `API_BASE` constant in `background/service-worker.js` matches your production URL.

### Security

The extension requires **no API keys** to be stored locally. It utilizes `chrome.cookies` to establish an authenticated session with your Vercel instance, tunneling your browser's existing auth state.

---

## 🌍 Distribution Models

### Model A: The Public-Facing Proxy (Read-Only)

Allows users to read your content without giving them write-access to your data.

1. Enable `PublicBlogList.tsx` and `PublicThoughtsList.tsx`.
2. Share your public link (e.g., `https://[app-url]/[username]`).

### Model B: The Sovereign Node Template (Forkable)

Allows others to replicate your infrastructure for their own use.

1. Make your repository public.
2. Include a "Deploy to Vercel" button in this README.
3. Users fork the repo, provide their own GitHub OAuth keys, and initialize their own private storage node.

---

## ✅ Verification Checklist

* [ ] OAuth application registered with `repo` scope.
* [ ] Vercel environment variables fully populated.
* [ ] `content/thoughts.json` initialized as `[]` in the private repo.
* [ ] Chrome extension manifest host permissions allow your domain.
* [ ] Verified session persistence via `getServerSession`.

---

## 🛠️ Troubleshooting

| Symptom | Diagnosis | Remediation |
| --- | --- | --- |
| `Client-side exception` | Markdown AST crash | Wrap content in Markdown code blocks (```text). |
| `404 Not Found` | Repo scope issue | Regenerate OAuth token with `repo` permissions. |
| `Unauthorized` | Session Expired | Log out and back in to refresh JWT. |
| `Missing Data` | Schema Mismatch | Ensure `id` is a 13-digit string Epoch timestamp. |
