package store

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"strings"
	"sync"
	"time"

	"github.com/example/notes-api/internal/model"
	"github.com/google/uuid"
)

var (
	ErrNotFound      = errors.New("note not found")
	ErrTitleRequired = errors.New("title is required")
	ErrTitleTooLong  = errors.New("title must be 200 characters or fewer")
)

type Store struct {
	mu       sync.RWMutex
	notes    map[string]*model.Note
	filePath string
}

func New(filePath string) (*Store, error) {
	s := &Store{notes: make(map[string]*model.Note), filePath: filePath}
	if err := s.load(); err != nil && !errors.Is(err, os.ErrNotExist) {
		return nil, fmt.Errorf("loading notes: %w", err)
	}
	return s, nil
}

func (s *Store) load() error {
	data, err := os.ReadFile(s.filePath)
	if err != nil {
		return err
	}
	var notes []*model.Note
	if err := json.Unmarshal(data, &notes); err != nil {
		return fmt.Errorf("parsing notes file: %w", err)
	}
	for _, n := range notes {
		s.notes[n.ID] = n
	}
	return nil
}

func (s *Store) persist() error {
	notes := make([]*model.Note, 0, len(s.notes))
	for _, n := range s.notes {
		notes = append(notes, n)
	}
	data, err := json.MarshalIndent(notes, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(s.filePath, data, 0644)
}

func (s *Store) Create(req model.CreateNoteRequest) (*model.Note, error) {
	if strings.TrimSpace(req.Title) == "" {
		return nil, ErrTitleRequired
	}
	if len(req.Title) > 200 {
		return nil, ErrTitleTooLong
	}
	if req.Tags == nil {
		req.Tags = []string{}
	}

	now := time.Now().UTC()
	note := &model.Note{
		ID:        uuid.NewString(),
		Title:     strings.TrimSpace(req.Title),
		Content:   req.Content,
		Tags:      req.Tags,
		CreatedAt: now,
		UpdatedAt: now,
	}

	s.mu.Lock()
	defer s.mu.Unlock()
	s.notes[note.ID] = note
	if err := s.persist(); err != nil {
		delete(s.notes, note.ID)
		return nil, fmt.Errorf("persisting note: %w", err)
	}
	return note, nil
}

func (s *Store) GetAll(search, tag string) []*model.Note {
	s.mu.RLock()
	defer s.mu.RUnlock()

	result := make([]*model.Note, 0)
	search = strings.ToLower(search)
	tag = strings.ToLower(tag)

	for _, n := range s.notes {
		if search != "" {
			if !strings.Contains(strings.ToLower(n.Title), search) &&
				!strings.Contains(strings.ToLower(n.Content), search) {
				continue
			}
		}
		if tag != "" {
			found := false
			for _, t := range n.Tags {
				if strings.ToLower(t) == tag {
					found = true
					break
				}
			}
			if !found {
				continue
			}
		}
		result = append(result, n)
	}
	return result
}

func (s *Store) GetByID(id string) (*model.Note, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()
	note, ok := s.notes[id]
	if !ok {
		return nil, ErrNotFound
	}
	return note, nil
}

func (s *Store) Update(id string, req model.UpdateNoteRequest) (*model.Note, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	note, ok := s.notes[id]
	if !ok {
		return nil, ErrNotFound
	}

	if req.Title != nil {
		t := strings.TrimSpace(*req.Title)
		if t == "" {
			return nil, ErrTitleRequired
		}
		if len(t) > 200 {
			return nil, ErrTitleTooLong
		}
		note.Title = t
	}
	if req.Content != nil {
		note.Content = *req.Content
	}
	if req.Tags != nil {
		note.Tags = req.Tags
	}
	note.UpdatedAt = time.Now().UTC()

	if err := s.persist(); err != nil {
		return nil, fmt.Errorf("persisting update: %w", err)
	}
	return note, nil
}

func (s *Store) Delete(id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, ok := s.notes[id]; !ok {
		return ErrNotFound
	}
	delete(s.notes, id)
	return s.persist()
}

func (s *Store) Stats() map[string]interface{} {
	s.mu.RLock()
	defer s.mu.RUnlock()
	tagCounts := make(map[string]int)
	for _, n := range s.notes {
		for _, t := range n.Tags {
			tagCounts[strings.ToLower(t)]++
		}
	}
	return map[string]interface{}{
		"total_notes": len(s.notes),
		"tag_counts":  tagCounts,
	}
}
