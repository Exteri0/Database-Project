const Pool = require('pg').Pool;

/*HOST IP: 34.136.252.133
PORT: 5432 
user: testuser
database: testdb2
password: 123
127.0.0.1*/

const pool = new Pool({
    user: "testuser",
    host: "34.136.252.133",
    database: "testdb2",
    password: "123",
    port: "5432",
    ssl:{
    rejectUnauthorized: false, // Use true for proper certificate verification
    },
})

module.exports = pool;