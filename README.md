# URL Shortener — FastAPI + Poetry

A URL shortening service with click tracking and analytics, built with FastAPI and managed by Poetry.

## Features
- Shorten any URL with auto-generated or custom aliases
- Redirect tracking: every visit records timestamp, referrer, and user agent
- Analytics endpoint showing click history per link
- List all shortened URLs
- Soft-delete (deactivate) links

## Tech Stack
FastAPI · SQLAlchemy (async) · SQLite · Uvicorn · Poetry

## Run

```bash
# Install Poetry (if not already installed)
curl -sSL https://install.python-poetry.org | python3 -

# Install dependencies (no virtualenv — disable it for container use)
poetry config virtualenvs.create false
poetry install --no-root

# Start production server
uvicorn app.main:app --host 0.0.0.0 --port 8000
# → http://localhost:8000
# → Docs at http://localhost:8000/docs
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/shorten` | Shorten a URL |
| GET | `/{short_code}` | Redirect to original URL |
| GET | `/info/{short_code}` | Get URL info without redirecting |
| GET | `/analytics/{short_code}` | Click analytics |
| GET | `/list/all` | List all shortened URLs |
| DELETE | `/{short_code}` | Deactivate a short URL |
| GET | `/health` | Health check |

## Example Request

```bash
curl -X POST http://localhost:8000/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com/some/long/path", "title": "My Link"}'
```
