const Pool = require("pg").Pool;

/**this is used to connect with the car database.
 * And every time we want to perform some operation  (add, update, delete)
 * we call this function
 **/

const devConfig = {
    user: process.env.PGUSER,
    password:process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port:process.env.PGPORT,
    database: process.env.PGDATABASE
}

const proConfig = {
    connectionString: process.env.DATABASE_URL
}

const pool = new Pool(
    process.env.NODE_ENV === "production" ? proConfig : devConfig
);


module.exports =  {
    query: (text, params, callback) => {
        return pool.query(text, params, callback)
    }
}
;