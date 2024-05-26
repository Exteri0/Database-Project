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

const addBookToLibraryWithCopies = async (req, res) => {
    const { ISBN_Entry, bookNameEntry, bookGenreEntry, LibraryIDEntry, numberOfCopiesEntry, authorSSNEntry, authorNameEntry } = req.body;
    console.log("ISBN ENTRY = ", ISBN_Entry)
    console.log("Library ID = ", LibraryIDEntry);

    const client = await pool.connect();

    try {
        // Check if author exists in DB
        const authorResult = await client.query(queries.checkIfAuthorExistsInDB, [authorSSNEntry]);
        if (!(authorResult.rows.length)) {
            await client.query(queries.addNewAuthorToDB, [authorSSNEntry, authorNameEntry]);
            console.log("New Author Added!");
        }

        // Check if library exists
        const libraryResult = await client.query(queries.getLibrariesById, [LibraryIDEntry]);
        if (!(libraryResult.rows.length)) {
            res.send("Library Doesn't exist!!");
            return;
        }

        // Check if book exists in library
        const bookResult = await client.query(queries.checkBookExistsinLibrary, [ISBN_Entry, LibraryIDEntry]);
        if (!(bookResult.rows.length)) {
            await client.query('BEGIN');

            // Check if genre exists
            const genreResult = await client.query(queries.checkIfGenreExists, [bookGenreEntry]);
            if (!(genreResult.rows.length)) {
                await client.query(queries.addGenreToDB, [bookGenreEntry]);
                console.log("Book Genre didn't exist, added it");
            }

            // Add book to library
            await client.query(queries.addBookToLibraryWithCopiesPart1, [ISBN_Entry, bookNameEntry, bookGenreEntry]);
            await client.query(queries.addBookToLibraryWithCopiesPart2, [ISBN_Entry, LibraryIDEntry, numberOfCopiesEntry]);
            await client.query(queries.addBookToLibraryWithCopiesPart3, [numberOfCopiesEntry, LibraryIDEntry]);
            await client.query(queries.addBookToLibraryWithCopiesPart4, [authorSSNEntry, ISBN_Entry]);

            await client.query('COMMIT');
            console.log("Book added!");
            res.status(201).send("Book Didn't exist, Added with copies Successfully");
        } else {
            await client.query('BEGIN');

            // Increase number of book copies
            await client.query(queries.increaseNumberOfBookCopiesPart1, [ISBN_Entry, numberOfCopiesEntry]);
            await client.query(queries.increaseNumberOfBookCopiesPart2, [ISBN_Entry, LibraryIDEntry, numberOfCopiesEntry]);

            await client.query('COMMIT');
            console.log("Book copies added successfully");
            res.status(201).send("Book Already exists, copies added successfully");
        }
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Transaction failed: ', error);
        res.status(500).send('Transaction failed');
    } finally {
        client.release();
    }
};

const addBookToLibraryWithoutCopies = async (req, res) => {
    const { ISBN_Entry, bookNameEntry, bookGenreEntry, LibraryIDEntry, authorSSNEntry, authorNameEntry } = req.body;
    console.log("ISBN ENTRY = ", ISBN_Entry)
    console.log("Library ID = ", LibraryIDEntry);

    const client = await pool.connect();

    try {
        // Check if author exists in DB
        const authorResult = await client.query(queries.checkIfAuthorExistsInDB, [authorSSNEntry]);
        if (!(authorResult.rows.length)) {
            console.log("Author doesn't exist");
            await client.query(queries.addNewAuthorToDB, [authorSSNEntry, authorNameEntry]);
            console.log("New Author Added!");
        }

        // Check if library exists
        const libraryResult = await client.query(queries.getLibrariesById, [LibraryIDEntry]);
        if (!(libraryResult.rows.length)) {
            res.status(201).send("Library doesn't exist!!");
            return;
        }

        // Check if book exists in library
        const bookResult = await client.query(queries.checkBookExistsinLibrary, [ISBN_Entry, LibraryIDEntry]);
        if (!(bookResult.rows.length)) {
            await client.query('BEGIN');

            // Check if genre exists
            const genreResult = await client.query(queries.checkIfGenreExists, [bookGenreEntry]);
            if (!(genreResult.rows.length)) {
                await client.query(queries.addGenreToDB, [bookGenreEntry]);
                console.log("Book genre didn't exist, added it!");
            }

            // Add book to library without copies
            await client.query(queries.addBookToLibraryWithoutCopiesPart1, [ISBN_Entry, bookNameEntry, bookGenreEntry]);
            await client.query(queries.addBookToLibraryWithoutCopiesPart2, [ISBN_Entry, LibraryIDEntry]);
            await client.query(queries.addBookToLibraryWithoutCopiesPart3, [authorSSNEntry, ISBN_Entry]);

            await client.query('COMMIT');
            console.log("Book Didn't exist, Added without copies Successfully");
            res.status(201).send("Book Didn't exist, Added without copies Successfully");
        } else {
            console.log("Book already exists, no copies are added!");
            res.status(201).send("Book already exists, no copies are added!");
        }
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Transaction failed: ', error);
        res.status(500).send('Transaction failed');
    } finally {
        client.release();
    }
};

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

const increaseNumberOfBookCopies = async (req, res) => {
    const { ISBN_Entry, LibraryIDEntry, numberOfCopiesEntry } = req.body;
    console.log("ISBN ENTRY = ", ISBN_Entry);
    console.log("Library ID = ", LibraryIDEntry);

    const client = await pool.connect();

    try {
        // Check if library exists
        const libraryResult = await client.query(queries.getLibrariesById, [LibraryIDEntry]);
        if (!(libraryResult.rows.length)) {
            res.status(201).send("Library Doesn't Exist!!");
            return;
        }

        // Check if book exists in library
        const bookResult = await client.query(queries.checkBookExistsinLibrary, [ISBN_Entry, LibraryIDEntry]);
        if (!(bookResult.rows.length)) {
            console.log("Operation failed, book doesn't exist!!");
            res.status(201).send("Book Doesn't Exist!!");
            return;
        }

        await client.query('BEGIN');

        // Increase number of book copies
        await client.query(queries.increaseNumberOfBookCopiesPart1, [ISBN_Entry, numberOfCopiesEntry]);
        await client.query(queries.increaseNumberOfBookCopiesPart2, [ISBN_Entry, LibraryIDEntry, numberOfCopiesEntry]);

        await client.query('COMMIT');
        console.log("Book copies added!");
        res.status(201).send("Book Already exists, copies added successfully");
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Transaction failed: ', error);
        res.status(500).send('Transaction failed');
    } finally {
        client.release();
    }
};

const reduceNumberOfBookCopies = async (req, res) => {
    const { ISBN_Entry, LibraryIDEntry, numberOfCopiesEntry } = req.body;
    console.log("ISBN ENTRY = ", ISBN_Entry);
    console.log("Library ID = ", LibraryIDEntry);

    const client = await pool.connect();

    try {
        // Check if library exists
        const libraryResult = await client.query(queries.getLibrariesById, [LibraryIDEntry]);
        if (!(libraryResult.rows.length)) {
            res.status(201).send("Library Doesn't Exist!!");
            return;
        }

        // Check if book exists in library
        const bookResult = await client.query(queries.checkBookExistsinLibrary, [ISBN_Entry, LibraryIDEntry]);
        if (!(bookResult.rows.length)) {
            console.log("Operation failed, book doesn't exist!!");
            res.status(201).send("Book Doesn't Exist!!");
            return;
        } else if (bookResult.rows[0].numberofcopies < numberOfCopiesEntry) {
            console.log("Operation failed, no book copies to remove");
            res.status(201).send("Not enough books!!");
            return;
        }

        await client.query('BEGIN');

        // Reduce number of book copies
        await client.query(queries.reduceNumberOfCopiesPart1, [ISBN_Entry, numberOfCopiesEntry]);
        await client.query(queries.reduceNumberOfCopiesPart2, [ISBN_Entry, LibraryIDEntry, numberOfCopiesEntry]);

        await client.query('COMMIT');
        console.log("Book copies removed!");
        res.status(201).send("Book exists, copies removed successfully");
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Transaction failed: ', error);
        res.status(500).send('Transaction failed');
    } finally {
        client.release();
    }
};
    


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
    reduceNumberOfBookCopies,

    //DELETE Requests,
    removeBookFromLibrary,
}