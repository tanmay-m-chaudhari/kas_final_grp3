package com.library.app.service;

import com.library.app.dto.BookRequest;
import com.library.app.exception.ResourceNotFoundException;
import com.library.app.model.Book;
import com.library.app.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepo;

    public List<Book> getAllBooks() { return bookRepo.findAll(); }

    public Book getById(Long id) {
        return bookRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
    }

    public Book getByIsbn(String isbn) {
        return bookRepo.findByIsbn(isbn).orElseThrow(() -> new ResourceNotFoundException("Book not found with ISBN: " + isbn));
    }

    public List<Book> searchBooks(String query) { return bookRepo.searchBooks(query); }
    public List<Book> getAvailableBooks() { return bookRepo.findByAvailableCopiesGreaterThan(0); }
    public List<Book> getByGenre(String genre) { return bookRepo.findByGenreIgnoreCase(genre); }

    @Transactional
    public Book addBook(BookRequest req) {
        if (bookRepo.existsByIsbn(req.getIsbn())) {
            throw new IllegalStateException("A book with ISBN " + req.getIsbn() + " already exists");
        }
        Book book = Book.builder()
            .isbn(req.getIsbn()).title(req.getTitle()).author(req.getAuthor())
            .genre(req.getGenre()).publisher(req.getPublisher())
            .publishedYear(req.getPublishedYear()).description(req.getDescription())
            .totalCopies(req.getTotalCopies()).availableCopies(req.getTotalCopies())
            .build();
        return bookRepo.save(book);
    }

    @Transactional
    public Book updateBook(Long id, BookRequest req) {
        Book book = getById(id);
        int diff = req.getTotalCopies() - book.getTotalCopies();
        book.setTitle(req.getTitle()); book.setAuthor(req.getAuthor());
        book.setGenre(req.getGenre()); book.setPublisher(req.getPublisher());
        book.setPublishedYear(req.getPublishedYear()); book.setDescription(req.getDescription());
        book.setTotalCopies(req.getTotalCopies());
        book.setAvailableCopies(Math.max(0, book.getAvailableCopies() + diff));
        return bookRepo.save(book);
    }

    @Transactional
    public void deleteBook(Long id) {
        Book book = getById(id);
        bookRepo.delete(book);
    }
}
