const pool = require('../../database');
const queries = require('./queries');

/*
----------------------------------------------------------------------------

BEGINNING OF ROUTER GET METHODS

----------------------------------------------------------------------------
*/
const getLibraries = (req, res) => {
    pool.query(queries.getLibraries, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};

const getLibrariesById = (req, res) => {
    const LibraryIDEntry = parseInt(req.params.id);
    pool.query(queries.getLibrariesById, [LibraryIDEntry], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    } )
};

const getNoBooksFromLibrary = (req, res) => {
    const LibraryIDEntry = parseInt(req.params.id);
    pool.query(queries.getNoBooksFromLibrary, [LibraryIDEntry], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};

const getBookDataByISBN = (req, res) => {
    const ISBN_Entry = req.params.ISBN;
    pool.query(queries.getBookDataByISBN, [ISBN_Entry], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};

const getBookAuthors = (req, res) => {
    const ISBN_Entry = req.params.ISBN;
    pool.query(queries.getBookAuthors, [ISBN_Entry], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};

const showBooksInaLibrary = (req, res) => {
    const LibraryIDEntry = parseInt(req.params.id)
    pool.query(queries.getLibrariesById, [LibraryIDEntry], (errorQ1, results) => {
        if (errorQ1) throw errorQ1;
        else if (!(results.rows.length)) {
            res.send('Library Doesn\'t exist!!');
        }
        else {
            pool.query(queries.showBooksInaLibrary, [LibraryIDEntry], (errorQ2, results) => {
                if (errorQ2) throw errorQ2;
                res.status(200).json(results.rows);
            })
        }
    })
}

const checkBookExistsinLibrary = (req, res) => {
    const LibraryIDEntry = parseInt(req.params.id);
    const ISBN_Entry = req.params.ISBN
    pool.query(queries.getLibrariesById, [LibraryIDEntry], (errorQ1, resultsQ1) => {
        if (errorQ1) throw errorQ1;
        else if (!(resultsQ1.rows.length)) {
            res.send("Library Doesn\'t exist!!");
        }
        else {
            pool.query(queries.checkBookExistsinLibrary, [ISBN_Entry, LibraryIDEntry], (errorQ2, resultsQ2) => { 
                if (errorQ2) throw errorQ2;
                else if (!(resultsQ2.rows.length)) {
                    res.send("Book Doesn\'t Exist");
                }
                else {
                    res.status(200).json(resultsQ2.rows);
                }
            })
        }
    })
}

/*
----------------------------------------------------------------------------

END OF ROUTER GET METHODS

----------------------------------------------------------------------------
*/

/*
----------------------------------------------------------------------------

BEGINNING OF ROUTER POST METHODS

----------------------------------------------------------------------------
*/

const addBookToLibraryWithCopies = (req, res) => {
    const { ISBN_Entry, bookNameEntry, bookGenreEntry, LibraryIDEntry, numberOfCopiesEntry } = req.body;
    console.log("ISBN ENTRY = ", ISBN_Entry)
    console.log("Library ID = ", LibraryIDEntry);
    pool.query(queries.getLibrariesById, [LibraryIDEntry], (errorQ1, resultsQ1) => {
        if (errorQ1) throw errorQ1;
        else if (!(resultsQ1.rows.length)) {
            res.send("Library Doesn\'t exist!!");
        }
        else {
            pool.query(queries.checkBookExistsinLibrary, [ISBN_Entry, LibraryIDEntry], (errorQ2, resultsQ2) => {
                if (errorQ2) throw errorQ2;
                else if (!(resultsQ2.rows.length)) {
                    pool.query(queries.addBookToLibraryWithCopies, [ISBN_Entry, bookNameEntry, bookGenreEntry, LibraryIDEntry, numberOfCopiesEntry], (errorQ3, resultsQ3) => {
                        if (errorQ3) throw errorQ3;
                        else {
                            res.status(201).send("Book added successful to Library!");
                        }
                    })
                }
                else {
                    pool.query('BEGIN');
                    pool.query(queries.increaseNumberOfBookCopiesPart1, [ISBN_Entry, numberOfCopiesEntry], (errorQ3, resultsQ3) => {
                        if (errorQ3) {pool.query('ROOLBACK'); throw errorQ3;}
                    })
                    pool.query(queries.increaseNumberOfBookCopiesPart2, [ISBN_Entry, LibraryIDEntry ,numberOfCopiesEntry], (errorQ3, resultsQ3) => {
                        if (errorQ3) {pool.query('ROOLBACK'); throw errorQ3;}
                    })
                    pool.query('COMMIT');
                    res.status(201).send("Book Already exists, copies added successfully");

                }
            })
        }
    })    
}

/*
----------------------------------------------------------------------------

END OF ROUTER POST METHODS

----------------------------------------------------------------------------
*/

module.exports = {
    //GET Methods
    getLibraries,
    getLibrariesById,
    getNoBooksFromLibrary,
    showBooksInaLibrary,
    getBookAuthors,
    getBookDataByISBN,
    checkBookExistsinLibrary,

    //POST Methods
    addBookToLibraryWithCopies,
    //addBookToLibraryWithoutCopies,
    //increaseNumberOfBookCopies,
}