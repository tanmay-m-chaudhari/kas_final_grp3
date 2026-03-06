package handler

import (
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"github.com/example/notes-api/internal/model"
	"github.com/example/notes-api/internal/store"
)

type Handler struct {
	store *store.Store
}

func New(s *store.Store) *Handler {
	return &Handler{store: s}
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
}

func (h *Handler) Routes() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /health", h.Health)
	mux.HandleFunc("GET /api/notes", h.ListNotes)
	mux.HandleFunc("POST /api/notes", h.CreateNote)
	mux.HandleFunc("GET /api/notes/stats", h.StatsNotes)
	mux.HandleFunc("GET /api/notes/{id}", h.GetNote)
	mux.HandleFunc("PUT /api/notes/{id}", h.UpdateNote)
	mux.HandleFunc("DELETE /api/notes/{id}", h.DeleteNote)
	return mux
}

func (h *Handler) Health(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok", "service": "notes-api"})
}

func (h *Handler) ListNotes(w http.ResponseWriter, r *http.Request) {
	search := r.URL.Query().Get("search")
	tag := r.URL.Query().Get("tag")
	notes := h.store.GetAll(search, tag)
	writeJSON(w, http.StatusOK, map[string]any{"count": len(notes), "notes": notes})
}

func (h *Handler) CreateNote(w http.ResponseWriter, r *http.Request) {
	var req model.CreateNoteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON: "+err.Error())
		return
	}
	note, err := h.store.Create(req)
	if err != nil {
		if errors.Is(err, store.ErrTitleRequired) || errors.Is(err, store.ErrTitleTooLong) {
			writeError(w, http.StatusUnprocessableEntity, err.Error())
		} else {
			writeError(w, http.StatusInternalServerError, err.Error())
		}
		return
	}
	writeJSON(w, http.StatusCreated, note)
}

func (h *Handler) GetNote(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	note, err := h.store.GetByID(id)
	if err != nil {
		if errors.Is(err, store.ErrNotFound) {
			writeError(w, http.StatusNotFound, "Note not found")
		} else {
			writeError(w, http.StatusInternalServerError, err.Error())
		}
		return
	}
	writeJSON(w, http.StatusOK, note)
}

func (h *Handler) UpdateNote(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	var req model.UpdateNoteRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeError(w, http.StatusBadRequest, "Invalid JSON: "+err.Error())
		return
	}
	note, err := h.store.Update(id, req)
	if err != nil {
		if errors.Is(err, store.ErrNotFound) {
			writeError(w, http.StatusNotFound, "Note not found")
		} else if errors.Is(err, store.ErrTitleRequired) || errors.Is(err, store.ErrTitleTooLong) {
			writeError(w, http.StatusUnprocessableEntity, err.Error())
		} else {
			writeError(w, http.StatusInternalServerError, err.Error())
		}
		return
	}
	writeJSON(w, http.StatusOK, note)
}

func (h *Handler) DeleteNote(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	if err := h.store.Delete(id); err != nil {
		if errors.Is(err, store.ErrNotFound) {
			writeError(w, http.StatusNotFound, "Note not found")
		} else {
			writeError(w, http.StatusInternalServerError, err.Error())
		}
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func (h *Handler) StatsNotes(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, h.store.Stats())
}

// Middleware: CORS + logging
func WithMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

// Suppress unused import warning
var _ = strings.ToLower
