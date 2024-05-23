const getLibraries = "SELECT * FROM libraries";
const getLibrariesById = "SELECT * FROM libraries WHERE libraryid = $1";
const getNoBooksFromLibrary = "SELECT numberOfBooks FROM libraries WHERE libraryID = $1 ";
const showBooksInaLibrary = `
    SELECT ISBN, bookName AS Book_Name, bookGenre AS Book_Genre, numberOfCopies AS Number_Copies
    FROM bookLibraryRelationship AS BLR, libraryBooks AS B
    WHERE libraryID = $1 AND BLR.ISBNBook = B.ISBN ORDER BY 
`;
const getBookAuthors = `
    SELECT authorName AS Author_Name
    FROM bookAuthorRelationship AS BLR
    WHERE BLR.ISBNBook = $1;
`;
const getBookDataByISBN = `
    SELECT bookName as Book_Name, bookGenre as Book_Genre
    FROM librarybooks
    WHERE ISBN = $1
`;



module.exports = {
    getLibraries,
    getLibrariesById,
    getNoBooksFromLibrary,
    showBooksInaLibrary,
    getBookAuthors,
    getBookDataByISBN,
}