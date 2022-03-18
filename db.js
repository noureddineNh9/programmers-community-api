const mysql = require("mysql");

var con = mysql.createConnection({
   host: "localhost",
   database: "espace_programmeur_db",
   user: "root",
   password: "",
});

module.exports = {
   con,
};
