const pool = require('../../database');
const queries = require('./queries');
const oqueries = require('../library/queries');

/*
----------------------------------------------------------------------------

BEGINNING OF ROUTER GET METHODS

----------------------------------------------------------------------------
*/

const getUsers1 = (req, res) => {
    pool.query(queries.getUsers1, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};

const getUsers2 = (req, res) => {
    pool.query(queries.getUsers2, (error, results) => {
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
    if (membershipStatus != "normal" || membershipStatus != "premium"){
        res.status(500).send("Wrong Membership!");
    }
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

const returnBook = async (req, res) => {
    const { transactionID, ISBN_Entry, LibraryIDEntry } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const resultsQ1 = await client.query(oqueries.getLibrariesById, [LibraryIDEntry]);
        if (resultsQ1.rows.length === 0) {
            await client.query('ROLLBACK');
            res.send("Library Doesn't Exist!!");
            return;
        }

        const resultsQ2 = await client.query(oqueries.checkBookExistsinLibrary, [ISBN_Entry, LibraryIDEntry]);
        if (resultsQ2.rows.length === 0) {
            await client.query('ROLLBACK');
            res.send("Book Doesn't Exist!!");
            return;
        }

        const resultsQ3 = await client.query(queries.getTransactionsById, [transactionID]);
        if (resultsQ3.rows.length === 0) {
            await client.query('ROLLBACK');
            res.send("Book Doesn't Exist!!");
            return;
        }
        else if (resultsQ3.rows[0].returnedon != null){
            await client.query('ROLLBACK');
            res.send("Book Returned!!");
            return;
        }

        await client.query(queries.returnBook, [transactionID]);
        await client.query(oqueries.increaseNumberOfBookCopiesPart1, [ISBN_Entry, 1]);
        await client.query(oqueries.increaseNumberOfBookCopiesPart2, [ISBN_Entry, LibraryIDEntry, 1]);

        await client.query('COMMIT');
        res.status(201).send("Book has been returned.");
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error returning book', error);
        res.status(500).send("An error occurred while returning the book.");
    } finally {
        client.release();
    }
};


const updateMembership = (req, res) => {
    const { MembershipStatusEntry, UserIDEntry } = req.body;
    if (MembershipStatusEntry != "normal" || MembershipStatusEntry != "premium"){
        res.status(500).send("Wrong Membership!");
    }
    pool.query(queries.updateMembership, [MembershipStatusEntry, UserIDEntry], (error, results) => {
        if (error) throw error;
        res.status(200).send("Membership Updated.");
    })
};


const BorrowBook = async (req, res) => {
    const { userIDEntry, ISBN_Entry, LibraryIDEntry } = req.body;

    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const resultsQ1 = await client.query(oqueries.getLibrariesById, [LibraryIDEntry]);
        if (resultsQ1.rows.length === 0) {
            await client.query('ROLLBACK');
            res.send("Library Doesn't Exist");
            return;
        }

        const resultsQ2 = await client.query(oqueries.checkBookExistsinLibrary, [ISBN_Entry, LibraryIDEntry]);
        if (resultsQ2.rows.length === 0) {
            await client.query('ROLLBACK');
            res.send("Book Doesn't Exist");
            return;
        }

        const resultsQ3 = await client.query(oqueries.GetNumberOfBooksInLibrary, [ISBN_Entry, LibraryIDEntry]);
        if (resultsQ3.rows.length === 0) {
            await client.query('ROLLBACK');
            res.send("Book Doesn't Exist.");
            return;
        }
        else if (resultsQ3.rows[0].numberofcopies === 0) {
            await client.query('ROLLBACK');
            res.send("Not Enough Books Exist.");
            return;
        }

        const resultsQ4 = await client.query(queries.getNumberUsersCurrentBorrowed, [userIDEntry]);
        const resultsQ5 = await client.query(queries.getUsersMembership, [userIDEntry]);

        const userBorrowCount = resultsQ4.rows[0].count;
        const userMembershipStatus = resultsQ5.rows[0].membershipstatus;

        if ((userBorrowCount === 3 && userMembershipStatus === "normal") || (userBorrowCount === 5 && userMembershipStatus === "premium")) {
            await client.query('ROLLBACK');
            res.send("Membership limit Exceeded!!");
            return;
        }

        await client.query(oqueries.reduceNumberOfCopiesPart1, [ISBN_Entry, 1]);
        await client.query(oqueries.reduceNumberOfCopiesPart2, [ISBN_Entry, LibraryIDEntry, 1]);
        await client.query(queries.BorrowBook, [userIDEntry, ISBN_Entry]);

        await client.query('COMMIT');
        res.status(201).send("Book has been borrowed successfully.");
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error borrowing book', error);
        res.status(500).send("An error occurred while borrowing the book.");
    } finally {
        client.release();
    }
};



module.exports = {
    //GET Methods
    getUsers1,
    getUsers2,
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