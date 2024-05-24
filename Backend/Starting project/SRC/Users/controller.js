const pool = require('../../database');
const queries = require('./queries');
const oqueries = require('../library/queries');

/*
----------------------------------------------------------------------------

BEGINNING OF ROUTER GET METHODS

----------------------------------------------------------------------------
*/

const getUsers = (req, res) => {
    pool.query(queries.getUsers, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};

const getTransactions = (req, res) => {
    pool.query(queries.getTransactions, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};

const getUsersById = (req, res) => {
    const UserIDEntry = parseInt(req.params.id);
    pool.query(queries.getUsersById, [UserIDEntry], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};

const getTransactionsById = (req, res) => {
    const TransactionIDEntry = parseInt(req.params.id);
    pool.query(queries.getTransactionsById, [TransactionIDEntry], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};

const getUsersAllBorrowed = (req, res) => {
    const UserIDEntry = parseInt(req.params.id);
    pool.query(queries.getUsersAllBorrowed, [UserIDEntry], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};

const getUsersCurrentBorrowed = (req, res) => {
    const UserIDEntry = parseInt(req.params.id);
    pool.query(queries.getUsersCurrentBorrowed, [UserIDEntry], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};

const getNumberUsersAllBorrowed = (req, res) => {
    const UserIDEntry = parseInt(req.params.id);
    pool.query(queries.getNumberUsersAllBorrowed, [UserIDEntry], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};

const getNumberUsersCurrentBorrowed = (req, res) => {
    const UserIDEntry = parseInt(req.params.id);
    pool.query(queries.getNumberUsersCurrentBorrowed, [UserIDEntry], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};

const getUsersTags = (req, res) => {
    const UserIDEntry = parseInt(req.params.id);
    pool.query(queries.getUsersTags, [UserIDEntry], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};

const getRecommendedBooks = (req, res) => {
    const UserIDEntry = parseInt(req.params.id);
    pool.query(queries.getRecommendedBooks, [UserIDEntry], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};
/*
----------------------------------------------------------------------------

BEGINNING OF ROUTER POST METHODS

----------------------------------------------------------------------------
*/
const addUser = (req, res) => {
    const {name, password, membershipStatus, libraryID} = req.body;
    pool.query(oqueries.getLibrariesById, [libraryID], (errorQ1, resultsQ1) => {
        if (errorQ1){
            res.send("Error 1");
            throw errorQ1;
        }
        else if (!(resultsQ1.rows.length)) {
            res.send("Library Doesn\'t exist!!");
        }
        else {
            pool.query(queries.addUser, [name, password, membershipStatus, libraryID], (errorQ2, resultsQ2) => {
                if (errorQ2){
                    res.send("Error 1");
                    throw errorQ2;
                }
                res.status(201).send("User Added Successfully");
            })
        }
    })
};

const returnBook = (req, res) => {
    const {transactionID, ISBN_Entry, LibraryIDEntry} = req.body;
    pool.query(oqueries.getLibrariesById, [LibraryIDEntry], (errorQ1, resultsQ1) => {
        if(errorQ1) throw errorQ1
        else if (!(resultsQ1.rows.length)) {
            res.send("Library Doesn't Exist!!");
        }
        else {
            pool.query(oqueries.checkBookExistsinLibrary, [ISBN_Entry, LibraryIDEntry], (errorQ2, resultsQ2) => {
                if (errorQ2) throw errorQ2;
                else if (!(resultsQ2.rows.length)) {
                    res.send("Book Doesn't Exist!!");
                }
                else {
                    pool.query('BEGIN');
                    pool.query(queries.returnBook, [transactionID], (errorQ3, resultsQ3) => {
                        if (errorQ3) {pool.query('ROLLBACK'); throw errorQ3;}
                    })
                    pool.query(oqueries.increaseNumberOfBookCopiesPart1, [ISBN_Entry, 1], (errorQ3, resultsQ3) => {
                        if (errorQ3) {pool.query('ROLLBACK'); throw errorQ3;}
                    })
                    pool.query(oqueries.increaseNumberOfBookCopiesPart2, [ISBN_Entry, LibraryIDEntry ,1], (errorQ3, resultsQ3) => {
                        if (errorQ3) {pool.query('ROLLBACK'); throw errorQ3;}
                    })
                    pool.query('COMMIT');
                    res.status(201).send("Book Already exists, copies added successfully");
                }
            })
        }
    })   
};


const updateMembership = (req, res) => {
    const {MembershipStatuesEntry, UserIDEntry} = req.body;
    pool.query(queries.updateMembership, [MembershipStatuesEntry, UserIDEntry], (error, results) => {
        if (error) throw error;
        res.status(201).send("Membership Updated.");
    })
};

/*
const BorrowBook = (req,res) => {
    const {userIDEntry, ISBN_Entry, LibraryIDEntry} = req.body;
    pool.query(oqueries.getLibrariesById, [LibraryIDEntry], (errorQ1, resultsQ1) => {
        if (errorQ1) throw errorQ1;
        else if (!(resultsQ1.rows.length)) {
            res.send("Library Doesn't Exist");
        }
        else {
            pool.query(oqueries.checkBookExistsinLibrary, [ISBN_Entry, LibraryIDEntry], (errorQ2, resultsQ2) => {
                if (errorQ2) throw errorQ2;
                else if (!(resultsQ2.rows.length)) {
                    res.send("Book Doesn't Exist");
                }
                else {
                    pool.query(queries.getNumberUsersCurrentBorrowed, [userIDEntry], (errorQ2, resultsQ2) => {
                        if (errorQ2) throw errorQ2;
                        pool.query(queries.getUsersMembership, [userIDEntry], (errorQ3, resultsQ3) => {
                            if (errorQ3) throw errorQ3;
                            if ((resultsQ2 == 3 && resultsQ3 == "normal") || (resultsQ2 == 5 && resultsQ3 == "premium")){
                                res.send("Membership limit Exceeded!!");
                            }
                            else {
                                pool.query('BEGIN');
                                pool.query(oqueries.removeBookFromLibrary, [ISBN_Entry, LibraryIDEntry], (errorQ4, resultsQ4) => {
                                    if (errorQ4) {pool.query('ROLLBACK'); throw errorQ4;}
                                } )
                                pool.query(queries.BorrowBook, [userIDEntry, ISBN_Entry], (errorQ4, resultsQ4) => {
                                    if (errorQ4) {pool.query('ROLLBACK'); throw errorQ4;}
                                } )
                                pool.query('COMMIT');
                                res.status(201).send("Book has been borrowed successfully.");
                            }
                        })
                    })
                }
            })
        }
    })
}
*/


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
    getRecommendedBooks,
    addUser,
    returnBook,
    updateMembership,
    //BorrowBook
}