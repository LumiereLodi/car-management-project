const Pool = require("pg").Pool;

/**this is used to connect with the car database.
 * And every time we want to perform some operation  (add, update, delete)
 * we call this function
 **/
const pool = new Pool({
    user: process.env.PGUSER,
    password:process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port:process.env.PGPORT,
    database: process.env.PGDATABASE
});


module.exports = pool;