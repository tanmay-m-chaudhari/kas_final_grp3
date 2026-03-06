package com.library.app.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class BorrowRequest {
    @NotBlank(message = "Borrower name is required") private String borrowerName;
    @NotBlank @Email(message = "Valid email required") private String borrowerEmail;
    @NotNull(message = "Due date is required") @Future(message = "Due date must be in the future") private LocalDate dueDate;
}
