# Andrew's Personal CRM

A lightweight, self-hosted CRM for managing personal and business relationships. Built with **TypeScript**, **Fastify**, and **SQLite**.

## Features

- **Contact management** — Add, edit, and delete contacts with details like company, title, email, phone, LinkedIn, and more
- **Relationship board** — Visual dashboard sorted by next follow-up date
- **Follow-up tracking** — Log interactions and get smart next-touch suggestions based on connection type and priority
- **Tags** — Arbitrary tags (up to 15 characters each) for flexible categorization
- **Dark mode** — Toggle between light and dark themes
- **CSV import/export** — Bulk manage contacts via CSV with semicolon-delimited tags
- **Search** — Live-search contacts by name, company, or email
- **Deduplication** — Prevents creating contacts with duplicate names

## Quick Start

```bash
cd personal_crm
npm install
npm run dev
```

The CRM will be available at [http://localhost:8000](http://localhost:8000).

## Project Structure

```
personal_crm/
├── bin/personal-crm    # CLI launcher script
├── src/
│   ├── app.ts          # Backend: API routes, database, schemas
│   ├── frontend.ts     # Frontend: full HTML/CSS/JS rendered server-side
│   └── server.ts       # Server entry point
├── package.json
└── tsconfig.json
```

## Tech Stack

- **Runtime**: Node.js 22+
- **Framework**: Fastify
- **Database**: SQLite (via `node:sqlite`)
- **Validation**: TypeBox
- **Frontend**: Server-rendered HTML with vanilla JS

"Cannot find module '.../dist/server.js'": This occurs if you run personal-crm without building the project. Use personal-crm dev instead, or run npm run build first.

node:sqlite errors: Ensure you are running Node v22+ by checking node -v.

## License

MIT
