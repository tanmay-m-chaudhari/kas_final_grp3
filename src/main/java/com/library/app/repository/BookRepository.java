package com.library.app.repository;

import com.library.app.model.Book;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByIsbn(String isbn);
    boolean existsByIsbn(String isbn);

    @Query("SELECT b FROM Book b WHERE " +
           "(:q IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%',:q,'%')) OR " +
           "LOWER(b.author) LIKE LOWER(CONCAT('%',:q,'%')) OR " +
           "LOWER(b.genre) LIKE LOWER(CONCAT('%',:q,'%')))")
    List<Book> searchBooks(@Param("q") String q);

    List<Book> findByAvailableCopiesGreaterThan(int count);
    List<Book> findByGenreIgnoreCase(String genre);
    List<Book> findByAuthorContainingIgnoreCase(String author);
}
