package com.library.app.service;

import com.library.app.dto.BorrowRequest;
import com.library.app.exception.ResourceNotFoundException;
import com.library.app.model.*;
import com.library.app.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.*;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BorrowService {

    private final BorrowRepository borrowRepo;
    private final BookRepository bookRepo;

    @Transactional
    public BorrowRecord borrowBook(Long bookId, BorrowRequest req) {
        Book book = bookRepo.findById(bookId)
            .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + bookId));

        if (book.getAvailableCopies() <= 0) {
            throw new IllegalStateException("No available copies for: " + book.getTitle());
        }
        if (borrowRepo.existsByBookIdAndBorrowerEmailAndStatus(bookId, req.getBorrowerEmail(), BorrowRecord.BorrowStatus.ACTIVE)) {
            throw new IllegalStateException("This borrower already has an active loan for this book");
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepo.save(book);

        return borrowRepo.save(BorrowRecord.builder()
            .book(book).borrowerName(req.getBorrowerName())
            .borrowerEmail(req.getBorrowerEmail())
            .borrowDate(LocalDate.now()).dueDate(req.getDueDate())
            .status(BorrowRecord.BorrowStatus.ACTIVE).build());
    }

    @Transactional
    public BorrowRecord returnBook(Long recordId) {
        BorrowRecord record = borrowRepo.findById(recordId)
            .orElseThrow(() -> new ResourceNotFoundException("Borrow record not found with id: " + recordId));

        if (record.getStatus() == BorrowRecord.BorrowStatus.RETURNED) {
            throw new IllegalStateException("This book has already been returned");
        }

        record.setReturnDate(LocalDate.now());
        record.setStatus(BorrowRecord.BorrowStatus.RETURNED);

        Book book = record.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepo.save(book);

        return borrowRepo.save(record);
    }

    public List<BorrowRecord> getRecordsByBook(Long bookId) { return borrowRepo.findByBookId(bookId); }
    public List<BorrowRecord> getActiveByEmail(String email) { return borrowRepo.findByBorrowerEmailAndStatus(email, BorrowRecord.BorrowStatus.ACTIVE); }
    public List<BorrowRecord> getOverdueRecords() { return borrowRepo.findOverdue(LocalDate.now()); }
    public List<BorrowRecord> getAllRecords() { return borrowRepo.findAll(); }

    @Scheduled(fixedRate = 3_600_000) // every hour
    @Transactional
    public void markOverdue() {
        List<BorrowRecord> overdue = borrowRepo.findOverdue(LocalDate.now());
        overdue.forEach(r -> r.setStatus(BorrowRecord.BorrowStatus.OVERDUE));
        borrowRepo.saveAll(overdue);
    }
}
