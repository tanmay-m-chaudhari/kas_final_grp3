# Notes API — Go

A JSON-persisted note-taking REST API built with Go's standard library. Notes survive restarts via a JSON flat-file store.

## Features
- Create, read, update, delete notes
- Full-text search across title and content (`?search=query`)
- Tag-based filtering (`?tag=work`)
- Per-tag statistics endpoint
- Graceful shutdown on SIGTERM/SIGINT
- Concurrent-safe with `sync.RWMutex`
- Notes persisted to `notes.json`

## Tech Stack
Go 1.22 (stdlib only, net/http) · `github.com/google/uuid`

## Run

```bash
# Build (CGO_DISABLED for static binary)
CGO_ENABLED=0 go build -o notes-api .

# Run
./notes-api
# → http://localhost:8080

# Optional env vars:
# PORT=9000 DATA_FILE=/data/notes.json ./notes-api
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/notes` | List notes (supports `?search=` and `?tag=`) |
| POST | `/api/notes` | Create a note |
| GET | `/api/notes/stats` | Note count and tag stats |
| GET | `/api/notes/{id}` | Get note by ID |
| PUT | `/api/notes/{id}` | Update a note |
| DELETE | `/api/notes/{id}` | Delete a note |

## Example

```bash
# Create a note
curl -X POST http://localhost:8080/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title": "Meeting Notes", "content": "Discuss Q3 roadmap...", "tags": ["work", "meetings"]}'

# Search
curl "http://localhost:8080/api/notes?search=roadmap"

# Filter by tag
curl "http://localhost:8080/api/notes?tag=work"
```
