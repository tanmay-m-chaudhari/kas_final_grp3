package com.library.app.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "books")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "ISBN is required")
    private String isbn;

    @Column(nullable = false)
    @NotBlank(message = "Title is required")
    @Size(max = 300)
    private String title;

    @Column(nullable = false)
    @NotBlank(message = "Author is required")
    private String author;

    private String genre;
    private String publisher;

    @Column(name = "published_year")
    private Integer publishedYear;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "total_copies")
    @Min(1)
    private int totalCopies = 1;

    @Column(name = "available_copies")
    private int availableCopies = 1;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.availableCopies = this.totalCopies;
    }
}
