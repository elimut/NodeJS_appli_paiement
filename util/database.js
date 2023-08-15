// import & store mysql's package to use
const mysql = require("mysql2");

// create connection's pool, object mysql. pool is better for multi queries. one req one connection. when req is finished, connection is retransmitted  in the pool et she's new available for a new query.
// passed a js object with informations about dbb
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "boutique",
  password: "root",
});

// export to use pool with promise to use promise when we work with this connextion who manage async tasks. We don't have nests callback
module.exports = pool.promise();
