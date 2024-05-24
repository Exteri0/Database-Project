/* Get */
const getUsers = "SELECT * FROM users";
const getTransactions = "SELECT * FROM transactions";
const getUsersById = "SELECT * FROM users WHERE userID = $1";
const getTransactionsById = "SELECT * FROM transactions WHERE transactionID = $1";
const getUsersAllBorrowed = `SELECT transactionID,ISBNBook,borrowedOn FROM transactions WHERE userID = $1`;
const getUsersCurrentBorrowed = "SELECT transactionID,ISBNBook,borrowedOn FROM transactions WHERE userID = $1 AND returnedOn IS NULL";
const getNumberUsersAllBorrowed = `SELECT COUNT(transactionID) FROM transactions WHERE userID = $1`;
const getNumberUsersCurrentBorrowed = "SELECT COUNT(transactionID) FROM transactions WHERE userID = $1 AND returnedOn IS NULL";


// Get Tags for user
// Get Recommended Books


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
    getNumberUsersCurrentBorrowed
}