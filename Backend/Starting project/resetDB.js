const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection configuration
const client = new Client({
    user: "testuser",
    host: "34.136.252.133",
    database: "testdb2",
    password: "123",
    port: "5432",
    ssl: {
        rejectUnauthorized: false, // Use true for proper certificate verification
    },
});

async function executeSqlFile(filePath) {
    try {
        // Connect to the PostgreSQL database
        await client.connect();

        // Read the SQL file
        const sql = fs.readFileSync(filePath, 'utf8');

        // Execute the SQL file
        await client.query(sql);

        console.log('SQL file executed successfully');
    } catch (err) {
        console.error('Error executing SQL file:', err);
    } finally {
        // Close the database connection
        await client.end();
    }
}

// Path to the SQL file
const sqlFilePath = "../DataBase PROJECT PSQL FILE.sql"

// Execute the SQL file
executeSqlFile(sqlFilePath);
