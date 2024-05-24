const getLibraries = "SELECT * FROM libraries";
const getLibrariesById = "SELECT * FROM libraries WHERE libraryid = $1";
const getNoBooksFromLibrary = "SELECT numberOfBooks FROM libraries WHERE libraryID = $1 ";
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


const addBookToLibraryWithCopies = `
    INSERT INTO Librarybooks (ISBN, bookName, bookGenre) VALUES ($1, %2, $3);
    INSERT INTO bookLibraryRelationship (ISBNBook, LibraryID, numberOfCopies) VALUES ($1, $4, $5);
    UPDATE Libraries set numberOfBooks = numberOfBooks + $5 WHERE libraryID = $4
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

const addBookToLibraryWithoutCopies = `
    INSERT INTO Librarybooks (ISBN, bookName, bookGenre) VALUES ($1, %2, $3);
    INSERT INTO bookLibraryRelationship (ISBNBook, LibraryID) VALUES ($1, $4);
`;



module.exports = {
    //Router GET Queries
    getLibraries,
    getLibrariesById,
    getNoBooksFromLibrary,
    showBooksInaLibrary,
    getBookAuthors,
    getBookDataByISBN,
    checkBookExistsinLibrary,

    //Router POST Queries
    addBookToLibraryWithCopies,
    addBookToLibraryWithoutCopies,
    increaseNumberOfBookCopiesPart1,
    increaseNumberOfBookCopiesPart2,
}