-- Seed books on first run (H2 only runs this if schema is created)
MERGE INTO books (id, isbn, title, author, genre, publisher, published_year, total_copies, available_copies, description)
KEY(isbn)
VALUES
  (1, '978-0-06-112008-4', 'To Kill a Mockingbird', 'Harper Lee', 'Fiction', 'J. B. Lippincott', 1960, 3, 3, 'A Pulitzer Prize-winning novel about racial injustice in the American South.'),
  (2, '978-0-7432-7356-5', '1984', 'George Orwell', 'Dystopian', 'Secker & Warburg', 1949, 4, 4, 'A chilling portrayal of a totalitarian society and its mechanisms of control.'),
  (3, '978-0-7432-7357-2', 'The Great Gatsby', 'F. Scott Fitzgerald', 'Classic', 'Charles Scribner''s Sons', 1925, 2, 2, 'A tale of wealth, love, and the American dream in the 1920s.'),
  (4, '978-0-525-55360-5', 'The Midnight Library', 'Matt Haig', 'Fiction', 'Canongate Books', 2020, 3, 3, 'A novel about all the lives we could be living and the choices that define us.'),
  (5, '978-0-385-54734-9', 'Project Hail Mary', 'Andy Weir', 'Sci-Fi', 'Ballantine Books', 2021, 2, 2, 'A lone astronaut must save Earth from a mysterious threat from the cosmos.');
