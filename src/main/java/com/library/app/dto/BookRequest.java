package com.library.app.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class BookRequest {
    @NotBlank(message = "ISBN is required") private String isbn;
    @NotBlank(message = "Title is required") @Size(max = 300) private String title;
    @NotBlank(message = "Author is required") private String author;
    private String genre;
    private String publisher;
    private Integer publishedYear;
    private String description;
    @Min(1) private int totalCopies = 1;
}
