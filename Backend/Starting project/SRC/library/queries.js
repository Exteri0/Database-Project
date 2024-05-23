const getLibraries = "SELECT * FROM libraries";
const getLibrariesById = "SELECT * FROM libraries WHERE id = $1";
const getNoBooksFromLibrary = "SELECT numberOfBooks FROM libraries WHERE libraryID = $1 ";
const showBooksInaLibrary = `
    SELECT ISBN, bookName AS Book_Name, bookGenre AS Book_Genre
    FROM 
    WHERE                         
`;


module.exports = {
    getLibraries,
    getLibrariesById,
    getNoBooksFromLibrary,
    showBooksInaLibrary,
}