const pool = require('../../database');
const queries = require('./queries');

const getLibraries = (req, res) => {
    pool.query(queries.getLibraries, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows)
    })
};

const getLibrariesById = (req, res) => {
    pool.query(queries.getLibrariesById, (error, results) => {
        if (error) throw error
        res.status(200).json(results.rows)
    })
};

module.exports = {
    getLibraries,
    getLibrariesById,
}