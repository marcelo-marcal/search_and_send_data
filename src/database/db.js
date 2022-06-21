import "dotenv/config";
import knex from "knex";
import Oracle from "oracledb";

Oracle.initOracleClient({ libDir: process.env.ORACLE_DIR });

// const db = knex({
  
//   client: "oracledb",
//   connection: {
//     host: "10.30.30.61",
//     user: "dbamv",
//     password: "dbamvah2016",
//     database: "mvtrn",
//   },
//   pool: {
//     min: 1,
//     max: 5,
//   },
// });

export default knex({
  client: "oracledb",
  connection: {
      user: "dbamv",
      password: "dbamvah2016",
      connectString: "(DESCRIPTION=(ADDRESS_LIST =(ADDRESS = (PROTOCOL = TCP)(HOST = 10.30.30.61)(PORT = 1521)))(CONNECT_DATA = (SERVER = DEDICATED) (SID = mvtrn)))",
      pool: {
        min: 1,
        max: 3,
      },
  }
});
