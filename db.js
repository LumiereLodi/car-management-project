const Pool = require("pg").Pool;
require("dotenv").config();


/**this is used to connect with the car database.
 * And every time we want to perform some operation  (add, update, delete)
 * we call this function
 **/

/*
const devConfig = {
    user: process.env.PGUSER,
    password:process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port:process.env.PGPORT,
    database: process.env.PGDATABASE
}
*/
const devConfig = `postgresql://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`;


const proConfig = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString:
      process.env.NODE_ENV === "production" ? proConfig : devConfig,
      ssl: process.env.NODE_ENV === "production" ? {
        rejectUnauthorized: false
      } : undefined
  });


module.exports =  {
    query: (text, params, callback) => {
        return pool.query(text, params, callback)
    }
}
;