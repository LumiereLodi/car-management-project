const Pool = require("pg").Pool;

/**this is used to connect with the car database.
 * And every time we want to perform some operation  (add, update, delete)
 * we call this function
 **/
const pool = new Pool({
    user: "postgres",
    password: "lumiere",
    host: "localhost",
    port: 5432,
    database: "cars"
});


module.exports = pool;