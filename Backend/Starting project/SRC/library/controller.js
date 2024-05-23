const pool = require('../../database');
const queries = require('./queries');

const getLibraries = (req, res) => {
    pool.query(queries.getLibraries, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};

const getLibrariesById = (req, res) => {
    const libraryID = parseInt(req.params.id);
    pool.query(queries.getLibrariesById, [libraryID], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    } )
};

const getNoBooksFromLibrary = (req, res) => {
    const libraryID = parseInt(req.params.id);
    pool.query(queries.getNoBooksFromLibrary, [libraryID], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    } )
}

const getBookDataByISBN = (req, res) => {
    const ISBN_Entry = req.params.ISBN;
    pool.query(queries.getNoBooksFromLibrary, [ISBN_Entry], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
}

const getBookAuthors = (req, res) => {
    const ISBN_Entry = req.params.ISBN
    pool.query(queries.getBookAuthors, [ISBN_Entry], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
}



module.exports = {
    getLibraries,
    getLibrariesById,
    getNoBooksFromLibrary,
    getBookDataByISBN,
    getBookAuthors,    
    
}