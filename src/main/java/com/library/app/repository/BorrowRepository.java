package com.library.app.repository;

import com.library.app.model.*;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.*;

@Repository
public interface BorrowRepository extends JpaRepository<BorrowRecord, Long> {
    List<BorrowRecord> findByBookId(Long bookId);
    List<BorrowRecord> findByBorrowerEmailAndStatus(String email, BorrowRecord.BorrowStatus status);
    List<BorrowRecord> findByStatus(BorrowRecord.BorrowStatus status);
    boolean existsByBookIdAndBorrowerEmailAndStatus(Long bookId, String email, BorrowRecord.BorrowStatus status);

    @Query("SELECT COUNT(r) FROM BorrowRecord r WHERE r.book.id = :bookId AND r.status = 'ACTIVE'")
    long countActiveByBookId(@Param("bookId") Long bookId);

    @Query("SELECT r FROM BorrowRecord r WHERE r.dueDate < :today AND r.status = 'ACTIVE'")
    List<BorrowRecord> findOverdue(@Param("today") LocalDate today);
}
