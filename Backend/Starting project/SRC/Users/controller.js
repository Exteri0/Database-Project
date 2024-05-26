const pool = require('../../database');
const client = pool.connect()
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

const getUsersInLibrary = (req, res) => {
    const LibraryIDEntry = parseInt(req.params.id);
    pool.query(queries.getUsersInLibrary, [LibraryIDEntry] ,(error, results) => {
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

const getUsersMembership = (req, res) => {
    const UserIDEntry = parseInt(req.params.id);
    pool.query(queries.getUsersMembership, [UserIDEntry], (error, results) => {
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

const getUserbyIDandPassword = (req, res) => {
    const UserIDEntry = parseInt(req.body.UserIDEntry, 10);
    const UserpasswordEntry = req.body.UserpasswordEntry;
    pool.query(queries.getUserbyIDandPassword, [UserIDEntry,UserpasswordEntry], (error, results) => {
        if (error) throw error;
        else if (!(results.rows.length)) {
            res.status(200).json({response : "Rejected"})
        }
        else {
            res.status(200).json({response : "Accepted"})
        }
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
        if (errorQ1){ throw errorQ1; }
        else if (!(resultsQ1.rows.length)) {
            res.send("Library Doesn\'t exist!!");
        }
        else {
            pool.query(queries.addUser, [name, password, membershipStatus, libraryID], (errorQ2, resultsQ2) => {
                if (errorQ2){throw errorQ2;}
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
                    client.query('BEGIN');
                    client.query(queries.returnBook, [transactionID], (errorQ3, resultsQ3) => {
                        if (errorQ3) {pool.query('ROLLBACK'); throw errorQ3;}
                    })
                    client.query(oqueries.increaseNumberOfBookCopiesPart1, [ISBN_Entry, 1], (errorQ3, resultsQ3) => {
                        if (errorQ3) {pool.query('ROLLBACK'); throw errorQ3;}
                    })
                    client.query(oqueries.increaseNumberOfBookCopiesPart2, [ISBN_Entry, LibraryIDEntry ,1], (errorQ3, resultsQ3) => {
                        if (errorQ3) {pool.query('ROLLBACK'); throw errorQ3;}
                    })
                    client.query('COMMIT');
                    client.release()
                    res.status(201).send("Book has been returned.");
                }
            })
        }
    })   
};


const updateMembership = (req, res) => {
    const { MembershipStatusEntry, UserIDEntry } = req.body;
    pool.query(queries.updateMembership, [MembershipStatusEntry, UserIDEntry], (error, results) => {
        if (error) throw error;
        res.status(200).send("Membership Updated.");
    })
};


const BorrowBook = (req,res) => {
    const {userIDEntry, ISBN_Entry, LibraryIDEntry} = req.body;
    pool.query(oqueries.getLibrariesById, [LibraryIDEntry], (errorQ1, resultsQ1) => {
        if (errorQ1) throw errorQ1;
        else if (!(resultsQ1.rows.length)) {
            res.send("Library Doesn't Exist");
            throw errorQ1;
        }
        else {
            pool.query(oqueries.checkBookExistsinLibrary, [ISBN_Entry, LibraryIDEntry], (errorQ2, resultsQ2) => {
                if (errorQ2) throw errorQ2;
                else if (!(resultsQ2.rows.length)) {
                    res.send("Book Doesn't Exist");
                    throw errorQ2;
                }
                else {
                    pool.query(oqueries.GetNumberOfBooksInLibrary, [ISBN_Entry, LibraryIDEntry], (errorQ2, resultsQ2) => {
                        if (errorQ2) throw errorQ2;
                        else if (!(resultsQ2.rows.length)) {
                            res.send("Book Doesn't Exist.");
                            throw errorQ2;
                        }
                        else if (resultsQ2.rows[0].numberofcopies == 0){
                            res.send("Not Enough Books Exist.");
                            throw errorQ2;
                        }
                        else {
                            pool.query(queries.getNumberUsersCurrentBorrowed, [userIDEntry], (errorQ2, resultsQ2) => {
                                if (errorQ2) throw errorQ2;
                                pool.query(queries.getUsersMembership, [userIDEntry], (errorQ3, resultsQ3) => {
                                    if (errorQ3) throw errorQ3;
                                    if ((resultsQ2.rows[0].count == 3 && resultsQ3.rows[0].membershipstatus == "normal") || (resultsQ2.rows[0].count == 5 && resultsQ3.rows[0].membershipstatus == "premium")){
                                        res.send("Membership limit Exceeded!!");
                                    }
                                    else {
                                        client.query('BEGIN');
                                        client.query(oqueries.reduceNumberOfCopiesPart1, [ISBN_Entry, 1], (errorQ4, resultsQ4) => {
                                            if (errorQ4) {pool.query('ROLLBACK'); throw errorQ4;}
                                        } )
                                        client.query(oqueries.reduceNumberOfCopiesPart2, [ISBN_Entry, LibraryIDEntry,1], (errorQ4, resultsQ4) => {
                                            if (errorQ4) {pool.query('ROLLBACK'); throw errorQ4;}
                                        } )
                                        client.query(queries.BorrowBook, [userIDEntry, ISBN_Entry], (errorQ4, resultsQ4) => {
                                            if (errorQ4) {pool.query('ROLLBACK'); throw errorQ4;}
                                        } )
                                        client.query('COMMIT');
                                        res.status(201).send("Book has been borrowed successfully.");
                                    }
                                })
                            })
                        }
                     })
                }
            })
        }
    })
}



module.exports = {
    //GET Methods
    getUsers,
    getUsersInLibrary,
    getTransactions,
    getUsersById,
    getUsersMembership,
    getTransactionsById,
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