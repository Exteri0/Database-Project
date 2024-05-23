const getLibraries = "SELECT * FROM libraries";
const getLibrariesById = "SELECT * FROM libraries WHERE id = $1";

module.exports = {
    getLibraries,
    getLibrariesById
}