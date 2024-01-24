const pg = require("pg");
const logger = require("../../middleware/winston");

//

const db_config = {
    // use the env file later 
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || "127.0.0.1",
    database: "Twitter",
    password: process.env.DB_PASSWORD || '12345',
    port: 5432,
    max: 10,
  };

  let db_connection;

  function startConnection() {
    // type parsers here
    pg.types.setTypeParser(1082, function (stringValue) {
      return stringValue; // 1082 for date type
    });
  
      pg.types.setTypeParser(1114, function (stringValue) {
        return stringValue; // 1114 for time without timezone type
      });
  
    db_connection = new pg.Pool(db_config);
  
    db_connection.connect((err, client) => {
      if (!err) {
        logger.info("PostgreSQL Connected");
      } else {
        logger.error("PostgreSQL connection failed");
        startConnection();
      }
    });
  
    db_connection.on("error", (err, client) => {
      logger.error("Unexpected error on idle client", err);
      startConnection();
    });
  }
  
  startConnection();
  
  // testing a select every 3 seconds :
  // to try the code you can stop postgresql service => select will fail
  // if you start back postgresql service => connection will restart correctly => select will succeed
  setInterval(function () {
    db_connection.query("SELECT $1", [1], (err, res) => {
      if (err) logger.error("SELECT 1", err.message);
    });
  }, 3000);
  
  module.exports = db_connection;
  
