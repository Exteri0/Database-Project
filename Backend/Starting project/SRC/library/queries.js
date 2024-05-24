/*
    HERE STARTS THE CODE FOR GET FUNCTIONALITIES 
*/

const getLibraries = `
    SELECT * FROM libraries
`;

const getAuthorsInDB = `
    SELECT * from Authors
`;

const getLibrariesById = `
    SELECT * FROM libraries WHERE libraryid = $1
`;
const getNoBooksFromLibrary = `
    SELECT numberOfBooks FROM libraries WHERE libraryID = $1
`;
const showBooksInaLibrary = `
    SELECT ISBN, bookName AS Book_Name, bookGenre AS Book_Genre, numberOfCopies AS Number_Copies
    FROM bookLibraryRelationship AS BLR, libraryBooks AS B
    WHERE libraryID = $1 AND BLR.ISBNBook = B.ISBN ORDER BY Book_Genre, Book_Name
`;
const getBookAuthors = `
    SELECT authorName AS Author_Name
    FROM bookAuthorRelationship AS BAR, authors AS A
    WHERE BAR.ISBNBook = $1 AND A.SSN = BAR.ssnAuthor;
`;
const getBookDataByISBN = `
    SELECT bookName as Book_Name, bookGenre as Book_Genre
    FROM librarybooks
    WHERE ISBN = $1
`;

const checkBookExistsinLibrary = `
    SELECT * FROM bookLibraryRelationship AS BLR
    WHERE ISBNBook = $1 AND libraryID = $2
`;

const checkIfAuthorOfBookExists = `
    SELECT * FROM bookAuthorRelationship as BLR
    WHERE ISBNBook = $1 and ssnAuthor = $2 
`;

/*
    HERE STARTS THE QUERY STATEMENTS FOR ADD FUNCTIONALITIES
*/

const addNewAuthorToDB = `
    INSERT INTO Authors (SSN, authorName) VALUES = ($1, $2)
`;


const addBookToLibraryWithCopiesPart1 = `
    INSERT INTO Librarybooks (ISBN, bookName, bookGenre) VALUES ($1, %2, $3);
`;

const addBookToLibraryWithCopiesPart2 = `
    INSERT INTO bookLibraryRelationship (ISBNBook, LibraryID, numberOfCopies) VALUES ($1, $2, $3);
`;

const addBookToLibraryWithCopiesPart3 = `
    UPDATE Libraries set numberOfBooks = numberOfBooks + $1 WHERE libraryID = $2
`;

const addBookToLibraryWithCopiesPart4 = `
    INSERT INTO bookAuthorRelationship (ssnAuthor, ISBNBook) VALUES ($1,$2)
`;

const increaseNumberOfBookCopiesPart1 = `
    UPDATE bookLibraryRelationship
    SET numberOfCopies = numberOfCopies + $2
    WHERE ISBNBook = $1;
`;
const increaseNumberOfBookCopiesPart2 = `    
    UPDATE Libraries
    SET numberOfBooks = numberOfBooks + $3 WHERE LibraryID IN (
    SELECT LibraryID from  bookLibraryRelationship as BLR
    WHERE BLR.LibraryID = $2 AND ISBNBook = $1
    )`;

const addBookToLibraryWithoutCopiesPart1 = `
    INSERT INTO Librarybooks (ISBN, bookName, bookGenre) VALUES ($1, %2, $3);
`;

const addBookToLibraryWithoutCopiesPart2 = `
    INSERT INTO bookLibraryRelationship (ISBNBook, LibraryID) VALUES ($1, $4);
`;



module.exports = {
    //Router GET Queries
    getLibraries,
    getLibrariesById,
    getAuthorsInDB,
    getNoBooksFromLibrary,
    showBooksInaLibrary,
    getBookAuthors,
    getBookDataByISBN,
    checkBookExistsinLibrary,
    checkIfAuthorOfBookExists,

    //Router POST Queries
    addNewAuthorToDB,

    addBookToLibraryWithCopiesPart1,
    addBookToLibraryWithCopiesPart2,
    addBookToLibraryWithCopiesPart3,
    addBookToLibraryWithCopiesPart4,

    addBookToLibraryWithoutCopiesPart1,
    addBookToLibraryWithoutCopiesPart2,

    increaseNumberOfBookCopiesPart1,
    increaseNumberOfBookCopiesPart2,
    
}