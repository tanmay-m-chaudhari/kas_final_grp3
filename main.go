package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/example/notes-api/internal/handler"
	"github.com/example/notes-api/internal/store"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	dataFile := os.Getenv("DATA_FILE")
	if dataFile == "" {
		dataFile = "notes.json"
	}

	s, err := store.New(dataFile)
	if err != nil {
		log.Fatalf("Failed to initialise store: %v", err)
	}

	h := handler.New(s)
	srv := &http.Server{
		Addr:         net.JoinHostPort("0.0.0.0", port),
		Handler:      handler.WithMiddleware(h.Routes()),
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		fmt.Printf("✅ Notes API listening on http://0.0.0.0:%s\n", port)
		fmt.Printf("📁 Data file: %s\n", dataFile)
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server error: %v", err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatalf("Graceful shutdown failed: %v", err)
	}
	fmt.Println("Server stopped gracefully")
}
