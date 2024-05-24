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
