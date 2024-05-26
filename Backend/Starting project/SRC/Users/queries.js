/* Get */
const getUsers = `
SELECT users.name,users.userID,users.membershipStatus,COUNT(transactions.transactionID)
FROM users,transactions
WHERE users.userID = transactions.userID
group by users.userID
order by users.userID`;

const getTransactions = "SELECT * FROM transactions";
const getUsersById = "SELECT * FROM users WHERE userID = $1";
const getTransactionsById = "SELECT * FROM transactions WHERE transactionID = $1";
const getUsersMembership = "SELECT membershipStatus FROM users WHERE userID = $1"

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
WHERE LibraryBooks.bookGenre IN (
    SELECT DISTINCT L.bookGenre
    FROM transactions, LibraryBooks AS L
    WHERE transactions.userID = $1 AND L.ISBN = transactions.ISBNBook 
)`;

const getUserbyIDandPassword = `
SELECT *
FROM users
WHERE userID = $1 AND password = $2;
`;

/* Post */
const addUser = `INSERT INTO Users (name, password, membershipStatus, libraryID) VALUES ($1, $2, $3, $4)`;

// User return the book to a library RETURN 
const returnBook = `
UPDATE transactions
SET returnedOn = CURRENT_TIMESTAMP
WHERE transactionID = $1;
`;

// Update Membership
const updateMembership = `
UPDATE Users
SET membershipStatus = $1
WHERE userID = $2;
`;

// Add book to user [Username,ID,Library Key] BORROW
const BorrowBook = `
INSERT INTO transactions (userID, ISBNBook) VALUES ($1, $2);
`;


module.exports = {
    //GET Methods
    getUsers,
    getTransactions,
    getUsersById,
    getTransactionsById,
    getUsersMembership,
    getUsersAllBorrowed,
    getUsersCurrentBorrowed,
    getNumberUsersAllBorrowed,
    getNumberUsersCurrentBorrowed,
    getUsersTags,
    getRecommendedBooks,
    getUserbyIDandPassword,
    //POST Methods
    addUser,
    returnBook,
    updateMembership,
    BorrowBook
}