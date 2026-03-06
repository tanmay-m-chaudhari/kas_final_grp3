# Library Book Management — Spring Boot + Maven

A RESTful library management system for cataloguing books and tracking borrow/return records.

## Features
- CRUD operations for book catalogue (title, author, ISBN, genre, copies)
- Borrow and return books with automatic copy count tracking
- Search books by title, author, or genre
- List available books, books by genre, overdue loans
- Automatic overdue detection (hourly scheduled task)
- Swagger UI at `/swagger-ui.html`
- H2 in-file database (persists restarts)
- Pre-seeded with 5 classic books

## Tech Stack
Spring Boot 3.3 · Java 21 · Maven · JPA/Hibernate · H2 Database · Springdoc OpenAPI · Lombok

## Run (Production)

```bash
mvn package -DskipTests
java -jar target/library-app-1.0.0.jar
# → http://localhost:8080
# → Swagger UI: http://localhost:8080/swagger-ui.html
```

## Docker

```bash
docker build -t library-app .
docker run -p 8080:8080 library-app
```

## API Endpoints

### Books
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/books` | List all books |
| GET | `/api/books/{id}` | Get by ID |
| GET | `/api/books/isbn/{isbn}` | Get by ISBN |
| GET | `/api/books/search?q=` | Search |
| GET | `/api/books/available` | Available only |
| GET | `/api/books/genre/{genre}` | By genre |
| POST | `/api/books` | Add book |
| PUT | `/api/books/{id}` | Update book |
| DELETE | `/api/books/{id}` | Delete book |

### Borrow / Return
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/borrow/{bookId}` | Borrow a book |
| POST | `/api/borrow/return/{recordId}` | Return a book |
| GET | `/api/borrow/book/{bookId}` | Records for book |
| GET | `/api/borrow/borrower/{email}` | Active loans by email |
| GET | `/api/borrow/overdue` | Overdue loans |
