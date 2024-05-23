-- Database: testdb2

--QUERIES TO DROP ALL TABLE IF NEEDED
--Dropping all constraints first
ALTER TABLE Librarians
DROP CONSTRAINT IF EXISTS fk_LibrariansPlace;

ALTER TABLE Libraries
DROP CONSTRAINT IF EXISTS fk_LibraryOwner;

ALTER TABLE LibraryBooks
DROP CONSTRAINT IF EXISTS fk_bookTOgenre;

ALTER TABLE bookLibraryRelationship
DROP CONSTRAINT IF EXISTS fk_LibraryHasBook;

ALTER TABLE bookLibraryRelationship
DROP CONSTRAINT IF EXISTS fk_bookData;

ALTER TABLE bookAuthorRelationship
DROP CONSTRAINT IF EXISTS fk_bookAuthor;

ALTER TABLE bookAuthorRelationship
DROP CONSTRAINT IF EXISTS fk_bookData;

--Now Drop ALL TABLES

DROP TABLE Librarians;
DROP TABLE Libraries;
DROP TABLE LibraryBooks;
DROP TABLE Authors;
DROP TABLE Genre;
DROP TABLE bookAuthorRelationship;
DROP TABLE bookLibraryRelationship;

--"-----------------"

CREATE TABLE IF NOT EXISTS Librarians(
	SSN char(10) not null,
	name varchar(30) not null,
	libraryID int not null,
	PRIMARY KEY (SSN)
	
);

CREATE TABLE IF NOT EXISTS Libraries(
	libraryID int not null,
	libraryName varchar(50) not null,
	numberOfBooks int not null default 0,
	numberOfUsers int not null default 0,
	PRIMARY KEY(libraryID)
);

CREATE TABLE IF NOT EXISTS LibraryBooks(
	ISBN char(10) not null,
	bookName varchar(70) not null,
	bookGenre varchar(20) not null,
	PRIMARY KEY (ISBN)
);

CREATE TABLE IF NOT EXISTS Authors(
	SSN char(10) not null,
	authorName varchar(30) not null,
	PRIMARY KEY (SSN)
);

CREATE TABLE IF NOT EXISTS Genre(
	genreName varchar(20) not null,
	PRIMARY KEY (genreName)
);

CREATE TABLE IF NOT EXISTS bookAuthorRelationship(
	ssnAuthor char(10) not null,
	ISBNBook char(10) not null,
	PRIMARY KEY (ssnAuthor, ISBNBook)
);

CREATE TABLE IF NOT EXISTS bookLibraryRelationship(
	ISBNBook char(10) not null,
	libraryID int not null,
	PRIMARY KEY (ISBNBook, libraryID),
	numberOfCopies int default 0
);


--Adding foreign Keys.
--Foreign key to relate the library to its librarian
ALTER TABLE Librarians
ADD CONSTRAINT fk_LibrariansPlace FOREIGN KEY (libraryID) REFERENCES Libraries (libraryID)
ON DELETE CASCADE
ON UPDATE CASCADE;
-- "-----------------"


--Foreign key to relate the library to its boooks
ALTER TABLE libraryBooks
ADD CONSTRAINT fk_bookTOgenre FOREIGN KEY (bookGenre) REFERENCES Genre (genreName)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE bookLibraryRelationship
ADD CONSTRAINT fk_LibraryHasBook FOREIGN KEY (libraryID) REFERENCES Libraries (libraryID)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE bookLibraryRelationship
ADD CONSTRAINT fk_BookData FOREIGN KEY (ISBNBook) REFERENCES LibraryBooks (ISBN)
ON DELETE CASCADE
ON UPDATE CASCADE;
-- "-----------------"

--Foreign key to relate the book to its authors
ALTER TABLE bookAuthorRelationship
ADD CONSTRAINT fk_bookAuthor FOREIGN KEY (ssnAuthor) REFERENCES Authors (SSN)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE bookAuthorRelationship
ADD CONSTRAINT fk_BookData FOREIGN KEY (ISBNBook) REFERENCES LibraryBooks (ISBN)
ON DELETE CASCADE
ON UPDATE CASCADE;
-- "-----------------"


-- Seeding example data to work on

-- Libraries
INSERT INTO libraries VALUES (1, 'Alex Library', 20, 1);
INSERT INTO libraries VALUES (2, 'Cairo Library', 18, 6);

-- Creating some librarians for them
INSERT INTO librarians VALUES (1, 'Ahmad',1);
INSERT INTO librarians VALUES (2, 'Omar',1);
INSERT INTO librarians VALUES (3, 'Peter',2);
INSERT INTO librarians VALUES (4, 'Myron',2);
INSERT INTO librarians VALUES (5, 'Mike',1);
INSERT INTO librarians VALUES (6, 'Amon',1);
INSERT INTO librarians VALUES (7, 'Gus',2);

--We create some genres
INSERT INTO genre VALUES ('Self-help'),('Action'),('Adventure'),('Fantasy'),('Horror'),('Romance'),('Science Fiction');

--Now we create some books
INSERT INTO Librarybooks VALUES ('7338203989', 'The Atomic Habits', 'Self-help');
INSERT INTO Librarybooks VALUES ('0486863786', 'The Lord of the Rings', 'Fantasy');
INSERT INTO Librarybooks VALUES ('1914130405', 'The Hitchhiker''s Guide to the Galaxy', 'Science Fiction');
INSERT INTO Librarybooks VALUES ('1915058414', 'The Adventures of Huckleberry Finn', 'Adventure');
INSERT INTO Librarybooks VALUES ('6598700418', 'Gone with the Wind,Margaret Mitchell', 'Romance');

