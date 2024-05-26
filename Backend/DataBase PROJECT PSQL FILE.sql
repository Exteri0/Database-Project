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

ALTER TABLE transactions 
DROP CONSTRAINT IF EXISTS fk_TransactionUser;

ALTER TABLE transactions
DROP CONSTRAINT IF EXISTS fk_TransactionBook;

ALTER TABLE Users 
DROP CONSTRAINT IF EXISTS fk_UserLibrary;



--Now Drop ALL TABLES

DROP TABLE IF EXISTS Librarians;
DROP TABLE IF EXISTS Libraries;
DROP TABLE IF EXISTS LibraryBooks;
DROP TABLE IF EXISTS Authors;
DROP TABLE IF EXISTS Genre;
DROP TABLE IF EXISTS bookAuthorRelationship;
DROP TABLE IF EXISTS bookLibraryRelationship;
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS transactions;
-- Creating the tables

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

CREATE TABLE IF NOT EXISTS Users(
    userID SERIAL PRIMARY KEY,
    name varchar(50) NOT NULL,
    password varchar(50) NOT NULL,
    membershipStatus varchar(20) CHECK (membershipStatus IN ('normal', 'premium')),
    libraryID int NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions(
    transactionID SERIAL PRIMARY KEY,
    userID int NOT NULL,
    ISBNBook char(10) NOT NULL,
    borrowedOn timestamp DEFAULT CURRENT_TIMESTAMP,
    returnedOn timestamp
);


--Adding foreign Keys.
--Foreign key to relate the library to its librarian
ALTER TABLE Librarians
ADD CONSTRAINT fk_LibrariansPlace FOREIGN KEY (libraryID) REFERENCES Libraries (libraryID)
ON DELETE CASCADE
ON UPDATE CASCADE;


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

-- Foreign key to relate the user to its library

ALTER TABLE Users
ADD CONSTRAINT fk_UserLibrary FOREIGN KEY (libraryID) REFERENCES Libraries (libraryID)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Foreign key to relate the user to its transactions
ALTER TABLE transactions
ADD CONSTRAINT fk_TransactionUser FOREIGN KEY (userID) REFERENCES Users (userID)
ON DELETE CASCADE
ON UPDATE CASCADE;

-- Foreign key to relate the book to its transactions
ALTER TABLE transactions
ADD CONSTRAINT fk_TransactionBook FOREIGN KEY (ISBNBook) REFERENCES LibraryBooks (ISBN)
ON DELETE CASCADE
ON UPDATE CASCADE;


-- "-----------------"


-- Seeding example data to work on

-- Libraries
INSERT INTO libraries VALUES (1, 'Alex Library', 26, 1);
INSERT INTO libraries VALUES (2, 'Cairo Library', 23, 1);

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
INSERT INTO Librarybooks VALUES ('4868637860', 'The Lord of the Rings', 'Fantasy');
INSERT INTO Librarybooks VALUES ('1914130405', 'The Hitchhiker''s Guide to the Galaxy', 'Science Fiction');
INSERT INTO Librarybooks VALUES ('1915058414', 'The Adventures of Huckleberry Finn', 'Adventure');
INSERT INTO Librarybooks VALUES ('6598700418', 'Gone with the Wind', 'Romance');
INSERT INTO Librarybooks VALUES ('9638451223', 'What Am I', 'Self-help');
INSERT INTO Librarybooks VALUES ('4538451245', 'Why', 'Horror');

--Create some authors
INSERT INTO authors VALUES (3,'James Clear');
INSERT INTO authors VALUES (2,'J.R.R. Tolkien');
INSERT INTO authors VALUES (4,'Douglas Adams');
INSERT INTO authors VALUES (1,'Margaret Mitchell');
INSERT INTO authors VALUES (5,'Mark Twain');
INSERT INTO authors VALUES (6,'Omar Ahmed');


--Relate them together
INSERT INTO bookAuthorRelationship VALUES (3,'7338203989');
INSERT INTO bookAuthorRelationship VALUES (2,'4868637860');
INSERT INTO bookAuthorRelationship VALUES (4,'1914130405');
INSERT INTO bookAuthorRelationship VALUES (1,'1915058414');
INSERT INTO bookAuthorRelationship VALUES (5,'6598700418');
INSERT INTO bookAuthorRelationship VALUES (6,'9638451223');
INSERT INTO bookAuthorRelationship VALUES (6,'4538451245');

--Put them in the libraries
INSERT INTO bookLibraryRelationship VALUES ('7338203989',1,5);
INSERT INTO bookLibraryRelationship VALUES ('7338203989',2,9);
INSERT INTO bookLibraryRelationship VALUES ('4868637860',2,5);
INSERT INTO bookLibraryRelationship VALUES ('1914130405',1,8);
INSERT INTO bookLibraryRelationship VALUES ('1915058414',2,3);
INSERT INTO bookLibraryRelationship VALUES ('6598700418',2,1);
INSERT INTO bookLibraryRelationship VALUES ('6598700418',1,7);
INSERT INTO bookLibraryRelationship VALUES ('9638451223',1,4);
INSERT INTO bookLibraryRelationship VALUES ('4538451245',1,2);
INSERT INTO bookLibraryRelationship VALUES ('4538451245',2,5);


-- Users
INSERT INTO Users (name, password, membershipStatus, libraryID) VALUES ('John Doe', 'password123', 'normal', 1);
INSERT INTO Users (name, password, membershipStatus, libraryID) VALUES ('Jane Smith', 'pass123', 'premium', 2);
INSERT INTO Users (name, password, membershipStatus, libraryID) VALUES ('Lil Uzi', 'pass321', 'normal', 2);
INSERT INTO Users (name, password, membershipStatus, libraryID) VALUES ('Kanye West', 'pass420', 'premium', 1);
INSERT INTO Users (name, password, membershipStatus, libraryID) VALUES ('Sabrina Carpenter', 'songs123', 'premium', 2);

-- transactions
INSERT INTO transactions (userID, ISBNBook) VALUES (1, '7338203989');
INSERT INTO transactions (userID, ISBNBook) VALUES (2, '4868637860');
INSERT INTO transactions (userID, ISBNBook) VALUES (3, '6598700418');
INSERT INTO transactions (userID, ISBNBook) VALUES (4, '9638451223');
INSERT INTO transactions (userID, ISBNBook) VALUES (4, '1914130405');
INSERT INTO transactions (userID, ISBNBook) VALUES (5, '4538451245');
INSERT INTO transactions (userID, ISBNBook) VALUES (5, '4868637860');

