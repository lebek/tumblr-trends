/* include node package and functions */
var mysql = require('mysql');
var dbf = require("./dbfunctions.js");

/* connect to local mysql server */
var dbserver = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1234',
    database: 'trends'
});


/* test functions */
dbf.dropTables(dbserver);
dbf.createTables(dbserver);

dbf.viewAllTables(dbserver);
//dbf.viewTableData(dbserver, 'example1');

dbf.addBlog(dbserver, 'firstBlog', '2022-02-30'); //add a new blog
dbf.viewTableData(dbserver, 'blog');			// print blog table to console




/* end connection with database */
dbserver.end();