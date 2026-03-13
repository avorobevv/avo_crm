# ts-fastapi-backend

A TypeScript backend starter that borrows the FastAPI shape:

- typed route contracts
- automatic OpenAPI generation
- interactive docs at `/docs`
- a small, explicit project layout

The runtime is [Fastify](https://fastify.dev/) with JSON-schema-driven routes via TypeBox.

## Project layout

```text
.
├── .github/workflows/ci.yml
├── src/
│   ├── app.ts
│   └── server.ts
├── tests/
│   ├── conftest.py
│   └── test_health.py
├── Dockerfile
├── docker-compose.yml
├── package.json
├── pyproject.toml
├── requirements-dev.txt
└── tsconfig.json
```

## Local development

### 1. Install dependencies

```bash
npm install
python -m pip install -r requirements-dev.txt
```

### 2. Run the API

```bash
npm run dev
```

The service listens on `http://127.0.0.1:8000` by default.

## Useful endpoints

- `GET /`
- `GET /health`
- `GET /docs`
- `GET /openapi.json`

## Quality gates

```bash
npm run typecheck
npm run build
pytest
pre-commit install
pre-commit run --all-files
```

`pytest` builds the TypeScript service, starts it on a temporary port, and verifies the API contract from Python.

## Docker

Build and run with Docker:

```bash
docker compose up --build
```

## GitHub Actions

The workflow in `.github/workflows/ci.yml` installs Node and Python, then runs:

- TypeScript type-checking
- production build
- pytest integration tests
- prettier verification
