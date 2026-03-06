package com.library.app.controller;

import com.library.app.dto.BorrowRequest;
import com.library.app.model.BorrowRecord;
import com.library.app.service.BorrowService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/borrow")
@RequiredArgsConstructor
@Tag(name = "Borrow", description = "Book borrowing and return management")
public class BorrowController {

    private final BorrowService borrowService;

    @PostMapping("/{bookId}")
    @Operation(summary = "Borrow a book")
    public ResponseEntity<BorrowRecord> borrowBook(@PathVariable Long bookId, @Valid @RequestBody BorrowRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(borrowService.borrowBook(bookId, req));
    }

    @PostMapping("/return/{recordId}")
    @Operation(summary = "Return a borrowed book")
    public BorrowRecord returnBook(@PathVariable Long recordId) {
        return borrowService.returnBook(recordId);
    }

    @GetMapping("/book/{bookId}")
    @Operation(summary = "Get all borrow records for a book")
    public List<BorrowRecord> getByBook(@PathVariable Long bookId) {
        return borrowService.getRecordsByBook(bookId);
    }

    @GetMapping("/borrower/{email}")
    @Operation(summary = "Get active loans for a borrower by email")
    public List<BorrowRecord> getActiveByEmail(@PathVariable String email) {
        return borrowService.getActiveByEmail(email);
    }

    @GetMapping("/overdue")
    @Operation(summary = "List all overdue loans")
    public List<BorrowRecord> getOverdue() { return borrowService.getOverdueRecords(); }

    @GetMapping
    @Operation(summary = "List all borrow records")
    public List<BorrowRecord> getAll() { return borrowService.getAllRecords(); }
}
