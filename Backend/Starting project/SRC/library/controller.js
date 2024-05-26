const { response } = require('express');
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

const getLibrarianByNameSSnLibraryID = (req, res) => {
    const { librarianSSNEntry, librarianNameEntry, LibraryIDEntry } = req.body;
    pool.query(queries.getLibrarianByNameSSnLibraryID, [librarianSSNEntry, librarianNameEntry, LibraryIDEntry], (error, results) => {
        if (error) throw error;
        else if (!(results.rows.length)) {
            res.status(200).json({response: "Rejected"})
        }
        else {
            res.status(200).json({response: LibraryIDEntry})
        }
    })
}

const getLibrariesById = (req, res) => {
    const LibraryIDEntry = parseInt(req.params.id);
    pool.query(queries.getLibrariesById, [LibraryIDEntry], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    } )
};

const getAllAuthorsInDB = (req, res) => {
    pool.query(queries.getAuthorsInDB, (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
}

const getNoBooksFromLibrary = (req, res) => {
    const LibraryIDEntry = parseInt(req.params.id);
    pool.query(queries.getNoBooksFromLibrary, [LibraryIDEntry], (error, results) => {
        if (error) throw error;
        res.status(200).json(results.rows);
    })
};

const GetNumberOfBooksInLibrary = (req, res) => {
    const ISBN_Entry = req.params.ISBN
    const LibraryIDEntry = parseInt(req.params.id);
    pool.query(queries.GetNumberOfBooksInLibrary, [ISBN_Entry,LibraryIDEntry], (error, results) => {
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
    const { ISBN_Entry, bookNameEntry, bookGenreEntry, LibraryIDEntry, numberOfCopiesEntry, authorSSNEntry, authorNameEntry } = req.body;
    console.log("ISBN ENTRY = ", ISBN_Entry)
    console.log("Library ID = ", LibraryIDEntry);
    pool.query(queries.checkIfAuthorExistsInDB, [authorSSNEntry], (errorQ1, resultsQ1) => {
        if (errorQ1) throw errorQ1;
        else if (!(resultsQ1.rows.length)) {
            pool.query(queries.addNewAuthorToDB, [authorSSNEntry, authorNameEntry], (errorQ2, resultsQ2) => {
                if (errorQ2) throw errorQ2;
                else console.log("New Author Added!");
            })
        }
    })
    pool.query(queries.getLibrariesById, [LibraryIDEntry], (errorQ1, resultsQ1) => {
        if (errorQ1) throw errorQ1;
        else if (!(resultsQ1.rows.length)) {
            res.send("Library Doesn\'t exist!!");
        }
        else {
            pool.query(queries.checkBookExistsinLibrary, [ISBN_Entry, LibraryIDEntry], (errorQ2, resultsQ2) => {
                if (errorQ2) throw errorQ2;
                else if (!(resultsQ2.rows.length)) {
                    pool.query('BEGIN');
                    pool.query(queries.checkIfGenreExists, [bookGenreEntry], (errorQ3, resultsQ3) => {
                        if (errorQ3) {pool.query('ROLLBACK'); throw errorQ3;}
                        else if (!(resultsQ3.rows.length)) {
                            pool.query(queries.addGenreToDB, [bookGenreEntry], (errorQ4, resultsQ4) => {
                                if(errorQ4) {pool.query('ROLLBACK'); throw errorQ4;}
                            })
                            res.status(201).send("Book Genre didn't exist, added it");
                        }
                    })
                    pool.query(queries.addBookToLibraryWithCopiesPart1, [ISBN_Entry, bookNameEntry, bookGenreEntry], (errorQ3, resultsQ3) => {
                        if (errorQ3) {pool.query('ROLLBACK'); throw errorQ3;}
                    })
                    pool.query(queries.addBookToLibraryWithCopiesPart2, [ISBN_Entry, LibraryIDEntry, numberOfCopiesEntry], (errorQ3, resultsQ3) => {
                        if (errorQ3) {pool.query('ROLLBACK'); throw errorQ3;}
                    })
                    pool.query(queries.addBookToLibraryWithCopiesPart3, [numberOfCopiesEntry, LibraryIDEntry], (errorQ3, resultsQ3) => {
                        if (errorQ3) {pool.query('ROLLBACK'); throw errorQ3;}
                    })
                    pool.query(queries.addBookToLibraryWithCopiesPart4, [authorSSNEntry, ISBN_Entry], (errorQ3, resultsQ3) => {
                        if (errorQ3) {pool.query('ROLLBACK'); throw errorQ3;}
                    })
                    
                    pool.query('COMMIT');
                    console.log("Book added!")
                    res.status(201).send("Book Didn't exist, Added with copies Successfully");
                }
                else {
                    pool.query('BEGIN');
                    pool.query(queries.increaseNumberOfBookCopiesPart1, [ISBN_Entry, numberOfCopiesEntry], (errorQ3, resultsQ3) => {
                        if (errorQ3) {pool.query('ROLLBACK'); throw errorQ3;}
                    })
                    pool.query(queries.increaseNumberOfBookCopiesPart2, [ISBN_Entry, LibraryIDEntry ,numberOfCopiesEntry], (errorQ3, resultsQ3) => {
                        if (errorQ3) {pool.query('ROLLBACK'); throw errorQ3;}
                    })
                    pool.query('COMMIT');
                    console.log("Book copies added successfully");
                    res.status(201).send("Book Already exists, copies added successfully");

                }
            })
        }
    })    
}

const addBookToLibraryWithoutCopies = (req, res) => {
    const { ISBN_Entry, bookNameEntry, bookGenreEntry, LibraryIDEntry, authorSSNEntry, authorNameEntry } = req.body;
    console.log("ISBN ENTRY = ", ISBN_Entry)
    console.log("Library ID = ", LibraryIDEntry);
    pool.query(queries.checkIfAuthorExistsInDB, [authorSSNEntry], (errorQ1, resultsQ1) => {
        if (errorQ1) throw errorQ1;
        else if (!(resultsQ1.rows.length)) {
            console.log("Author doesn't exist")
            pool.query(queries.addNewAuthorToDB, [authorSSNEntry, authorNameEntry], (errorQ2, resultsQ2) => {
                if (errorQ2) throw errorQ2;
                else console.log("New Author Added!");
            })
        }
    })
    pool.query(queries.getLibrariesById, [LibraryIDEntry], (errorQ1, resultsQ1) => {
        if (errorQ1) throw errorQ1;
        else if (!(resultsQ1.rows.length)) {
            res.send("Library Doesn\'t exist!!");
            res.status(201).send("Library doesn't exist!!")
        }
        else {
            pool.query(queries.checkBookExistsinLibrary, [ISBN_Entry, LibraryIDEntry], (errorQ2, resultsQ2) => {
                if (errorQ2) throw errorQ2;
                else if (!(resultsQ2.rows.length)) {
                    pool.query('BEGIN');
                    pool.query(queries.checkIfGenreExists, [bookGenreEntry], (errorQ3, resultsQ3) => {
                        if (errorQ3) {pool.query('ROLLBACK'); throw errorQ3;}
                        else if (!(resultsQ3.rows.length)) {
                            pool.query(queries.addGenreToDB, [bookGenreEntry], (errorQ4, resultsQ4) => {
                                if(errorQ4) {pool.query('ROLLBACK'); throw errorQ4;}
                            })
                            console.log("Book genre didn't exist, added it!");
                        }
                    })
                    pool.query(queries.addBookToLibraryWithoutCopiesPart1, [ISBN_Entry, bookNameEntry, bookGenreEntry], (errorQ3, resultsQ3) => {
                        if (errorQ3) { pool.query('ROLLBACK'); throw errorQ3; }
                    })
                    pool.query(queries.addBookToLibraryWithoutCopiesPart2, [ISBN_Entry, LibraryIDEntry], (errorQ3, resultsQ3) => {
                        if (errorQ3) { pool.query('ROLLBACK'); throw errorQ3; }
                    })
                    pool.query(queries.addBookToLibraryWithoutCopiesPart3, [authorSSNEntry, ISBN_Entry], (errorQ3, resultsQ3) => {
                        if (errorQ3) { pool.query('ROLLBACK'); throw errorQ3; }
                    })
                    pool.query('COMMIT');
                    console.log("Book Didn't exist, Added without copies Successfully")
                    res.status(201).send("Book Didn't exist, Added without copies Successfully");
                }
                else {
                    console.log("Book already exists, no copies are added!");
                    res.status(201).send("Book already exists, no copies are added!")
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

/*
----------------------------------------------------------------------------

BEGINNING OF ROUTER PATCH METHODS

----------------------------------------------------------------------------
*/

const increaseNumberOfBookCopies = (req, res) => {
    const { ISBN_Entry, LibraryIDEntry, numberOfCopiesEntry } = req.body;
    console.log("ISBN ENTRY = ", ISBN_Entry)
    console.log("Library ID = ", LibraryIDEntry);
    pool.query(queries.getLibrariesById, [LibraryIDEntry], (errorQ1, resultsQ1) => {
        if(errorQ1) throw errorQ1
        else if (!(resultsQ1.rows.length)) {
            res.send("Library Doesn't Exist!!");
        }
        else {
            pool.query(queries.checkBookExistsinLibrary, [ISBN_Entry, LibraryIDEntry], (errorQ2, resultsQ2) => {
                if (errorQ2) throw errorQ2;
                else if (!(resultsQ2.rows.length)) {
                    console.log("operation failed, book doesn't exist!!");
                    res.status(201).send("Book Doesn't Exist!!");
                }
                else {
                    pool.query('BEGIN');
                    pool.query(queries.increaseNumberOfBookCopiesPart1, [ISBN_Entry, numberOfCopiesEntry], (errorQ3, resultsQ3) => {
                        if (errorQ3) {pool.query('ROLLBACK'); throw errorQ3;}
                    })
                    pool.query(queries.increaseNumberOfBookCopiesPart2, [ISBN_Entry, LibraryIDEntry ,numberOfCopiesEntry], (errorQ3, resultsQ3) => {
                        if (errorQ3) {pool.query('ROLLBACK'); throw errorQ3;}
                    })
                    pool.query('COMMIT');
                    console.log("Book copies added!")
                    res.status(201).send("Book Already exists, copies added successfully");
                }
            })
        }
    })   
}
    


/*
----------------------------------------------------------------------------

END OF ROUTER PATCH METHODS

----------------------------------------------------------------------------
*/

/*
----------------------------------------------------------------------------

BEGINNING OF ROUTER DELETE METHODS

----------------------------------------------------------------------------
*/

const removeBookFromLibrary = (req, res) => {
    const { ISBN_Entry, LibraryIDEntry } = req.body;
    console.log("ISBN ENTRY = ", ISBN_Entry)
    console.log("Library ID = ", LibraryIDEntry);
    pool.query(queries.getLibrariesById, [LibraryIDEntry], (errorQ1, resultsQ1) => {
        if (errorQ1) throw errorQ1;
        else if (!(resultsQ1.rows.length)) {
            res.send("Library Doesn't Exist");
        }
        else {
            pool.query(queries.checkBookExistsinLibrary, [ISBN_Entry, LibraryIDEntry], (errorQ2, resultsQ2) => {
                if (errorQ2) throw errorQ2;
                else if (!(resultsQ2.rows.length)) {
                    console.log("Operation failed, no such book exists")
                    res.status(201).send("Book Doesn't Exist");
                }
                else {
                    pool.query(queries.removeBookFromLibrary, [ISBN_Entry, LibraryIDEntry], (errorQ3, resultsQ3) => {
                        if (errorQ3) throw errorQ3;
                        console.log("operation successful!")
                        res.status(201).send("Book Deleted Successfully");
                    } )
                }
            })
        }
    })
}



module.exports = {
    //GET Methods
    getLibraries,
    getLibrariesById,
    getLibrarianByNameSSnLibraryID,
    getNoBooksFromLibrary,
    showBooksInaLibrary,
    getBookAuthors,
    getBookDataByISBN,
    checkBookExistsinLibrary,
    getAllAuthorsInDB,
    GetNumberOfBooksInLibrary,

    //POST Methods
    addBookToLibraryWithCopies,
    addBookToLibraryWithoutCopies,

    //PATCH Requests
    increaseNumberOfBookCopies,

    //DELETE Requests,
    removeBookFromLibrary,
}