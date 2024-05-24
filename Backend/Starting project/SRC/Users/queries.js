/* Get */
const getUsers = "SELECT * FROM users";
const getTransactions = "SELECT * FROM transactions";
const getUsersById = "SELECT * FROM users WHERE userID = $1";
const getTransactionsById = "SELECT * FROM transactions WHERE transactionID = $1";

const getUsersAllBorrowed = `
SELECT transactions.transactionID,LibraryBooks.bookName,transactions.ISBNBook,transactions.borrowedOn 
FROM transactions, LibraryBooks
WHERE userID = $1 AND LibraryBooks.ISBN = transactions.ISBNBook`;

const getUsersCurrentBorrowed = `
SELECT transactions.transactionID,LibraryBooks.bookName,transactions.ISBNBook,transactions.borrowedOn 
FROM transactions, LibraryBooks
WHERE userID = $1 AND LibraryBooks.ISBN = transactions.ISBNBook AND returnedOn IS NULL`;

const getNumberUsersAllBorrowed = `SELECT COUNT(transactionID) FROM transactions WHERE userID = $1`;
const getNumberUsersCurrentBorrowed = "SELECT COUNT(transactionID) FROM transactions WHERE userID = $1 AND returnedOn IS NULL";

const getUsersTags = `
SELECT DISTINCT LibraryBooks.bookGenre
FROM transactions, LibraryBooks
WHERE transactions.userID = $1 AND LibraryBooks.ISBN = transactions.ISBNBook`;

const getRecommendedBooks = `
SELECT LibraryBooks.ISBN, LibraryBooks.bookName
FROM LibraryBooks
WHERE EXISTS (
    SELECT 1
    FROM transactions
    WHERE transactions.userID = $1 AND LibraryBooks.ISBN = transactions.ISBNBook
)`;

/* Post */



// Add user
// Add book to user [Username,ID,Library Key]
// 


module.exports = {
    //GET Methods
    getUsers,
    getTransactions,
    getUsersById,
    getTransactionsById,
    getUsersAllBorrowed,
    getUsersCurrentBorrowed,
    getNumberUsersAllBorrowed,
    getNumberUsersCurrentBorrowed,
    getUsersTags,
    getRecommendedBooks
}