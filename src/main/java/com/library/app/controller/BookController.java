package com.library.app.controller;

import com.library.app.dto.*;
import com.library.app.model.Book;
import com.library.app.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@Tag(name = "Books", description = "Book catalogue management")
public class BookController {

    private final BookService bookService;

    @GetMapping
    @Operation(summary = "List all books")
    public List<Book> getAllBooks() { return bookService.getAllBooks(); }

    @GetMapping("/{id}")
    @Operation(summary = "Get book by ID")
    public Book getBook(@PathVariable Long id) { return bookService.getById(id); }

    @GetMapping("/isbn/{isbn}")
    @Operation(summary = "Get book by ISBN")
    public Book getByIsbn(@PathVariable String isbn) { return bookService.getByIsbn(isbn); }

    @GetMapping("/search")
    @Operation(summary = "Search books by title, author, or genre")
    public List<Book> search(@RequestParam String q) { return bookService.searchBooks(q); }

    @GetMapping("/available")
    @Operation(summary = "List books with available copies")
    public List<Book> available() { return bookService.getAvailableBooks(); }

    @GetMapping("/genre/{genre}")
    @Operation(summary = "List books by genre")
    public List<Book> byGenre(@PathVariable String genre) { return bookService.getByGenre(genre); }

    @PostMapping
    @Operation(summary = "Add a new book")
    public ResponseEntity<Book> addBook(@Valid @RequestBody BookRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(bookService.addBook(req));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a book")
    public Book updateBook(@PathVariable Long id, @Valid @RequestBody BookRequest req) {
        return bookService.updateBook(id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete a book")
    public void deleteBook(@PathVariable Long id) { bookService.deleteBook(id); }
}
