-- Database: testdb2

CREATE DATABASE testdb2
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'C.UTF-8'
    LC_CTYPE = 'C.UTF-8'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

GRANT TEMPORARY, CONNECT ON DATABASE testdb2 TO PUBLIC;

GRANT ALL ON DATABASE testdb2 TO postgres;

GRANT CREATE, CONNECT ON DATABASE testdb2 TO testuser;

--QUERIES TO DROP ALL TABLE IF NEEDED
--Dropping all constraints first
ALTER TABLE Librarians
DROP CONSTRAINT fk_LibrariansPlace;

ALTER TABLE Libraries
DROP CONSTRAINT fk_LibraryOwner;

ALTER TABLE LibraryBooks
DROP CONSTRAINT fk_bookTOgenre;

ALTER TABLE bookLibraryRelationship
DROP CONSTRAINT fk_LibraryHasBook;

ALTER TABLE bookLibraryRelationship
DROP CONSTRAINT fk_bookData;

ALTER TABLE bookAuthorRelationship
DROP CONSTRAINT fk_bookAuthor;

ALTER TABLE bookAuthorRelationship
DROP CONSTRAINT fk_bookData;

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
	librarianSSN char(10) not null,
	libraryName varchar(50) not null,
	numberOfBooks int not null default 0,
	numberOfUsers int not null default 0,
	PRIMARY KEY(libraryID)
);

CREATE TABLE IF NOT EXISTS LibraryBooks(
	ISBN char(10) not null,
	bookName varchar(30) not null,
	bookGenre varchar(20) not null,
	numberOfCopies int default 0,
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
	PRIMARY KEY (ISBNBook, libraryID)
);


--Adding foreign Keys.
--Foreign key to relate the library to its librarian
ALTER TABLE Librarians
ADD CONSTRAINT fk_LibrariansPlace FOREIGN KEY (libraryID) REFERENCES Libraries (libraryID)
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE Libraries
ADD CONSTRAINT fk_LibraryOwner FOREIGN KEY (librarianSSN) REFERENCES Librarians (SSN)
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



