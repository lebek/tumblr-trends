var mysql = require('mysql');

/* Print results array to console */
function printArray(results) {
    for (var i in results) { 
            console.log(results[i]);
    }; 
}

/* Connect to local mysql server */
function connect() {
    return mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: '1234',
        database: 'trends'
    });
}

/* Create tables */
function createTables(dbserver) {

var createBlog = 'CREATE TABLE Blog(' +
                'hostname VARCHAR(255) NOT NULL,' +
                'date_added VARCHAR(50) NOT NULL,' +
                'PRIMARY KEY (hostname))';

var createTracklist = 'CREATE TABLE Tracklist(' +
                    'hostname VARCHAR(255) NOT NULL,' +
                    'post_id BIGINT NOT NULL,' +
                    'time_stamp VARCHAR(50) NOT NULL,' +
                    'note_count INT NOT NULL,' +
                    'PRIMARY KEY (hostname, post_id, time_stamp),' +
                    'FOREIGN KEY (hostname) REFERENCES Blog(hostname))'

    dbserver.query(createBlog, function(err, results) { if (err) throw err;});
    dbserver.query(createTracklist, function(err, results) { if (err) throw err;});
}

/* Drop tables */
function dropTables(dbserver) {
    dbserver.query('DROP TABLE Tracklist', function(err, results) { if (err) console.log("Tracklist table already dropped");});
    dbserver.query('DROP TABLE Blog', function(err, results) { if (err) console.log("Blog table already dropped");});
}

/* View all tables in database */
function viewAllTables(dbserver, cb) {
    dbserver.query('SHOW TABLES', function(err, results) {
        if (err) throw err;
        cb(results);
    });
}

/* View all data of a table */
function viewTableData(dbserver, inputTable, cb) {
    dbserver.query('SELECT * FROM ' + inputTable, function(err, results) {
        if (err) throw err;
        cb(results);
    });
}

/* Add a new blog */
function addBlog(dbserver, hostname) {
    dbserver.query("INSERT INTO Blog VALUES('" + hostname + "', now())", 
        function(err, results) {if (err) throw err;});
}

/* Add a new tracking to tracklist */
function addTracklist(dbserver, hostname, post_id, note_count) {
    dbserver.query("INSERT INTO Tracklist VALUES('" + hostname + "', '" + post_id + 
                    "', now(), '" + note_count +"' )", 
        function(err, results) {if (err) throw err;});
}

function test() {
    conn = connect();

    /* test functions */
    dropTables(conn);
    createTables(conn);

    viewAllTables(conn);

    addBlog(conn, 'firstBlog', '2022-02-30'); // add a new blog
    viewTableData(conn, 'Blog'); // print blog table to console

    conn.end();
}


/* export functions */
module.exports.connect = connect;
module.exports.createTables = createTables;
module.exports.dropTables = dropTables;
module.exports.viewAllTables = viewAllTables;
module.exports.viewTableData = viewTableData;
module.exports.addBlog = addBlog;
module.exports.addTracklist = addTracklist;
