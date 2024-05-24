const pool = require('../../database');
const queries = require('./queries');

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

/*
----------------------------------------------------------------------------

BEGINNING OF ROUTER POST METHODS

----------------------------------------------------------------------------
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
    getNumberUsersCurrentBorrowed
}