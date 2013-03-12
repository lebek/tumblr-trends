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

/* Connect to CDF mysql server */
/*function connect() {
    return mysql.createConnection({
        host: 'dbsrv1.cdf.toronto.edu',
        port: 3306,
        user: 'c0dialke',
        password: 'mooroong',
        database: 'csc309h_c0dialke'
    });
}*/


/* Create tables */
function createTables(dbserver) {

var createBlog = 'CREATE TABLE Blog(' +
                'hostname VARCHAR(255) NOT NULL,' +
                'date_added VARCHAR(50) NOT NULL,' +
                'PRIMARY KEY (hostname))';

var createTracklist = 'CREATE TABLE Tracklist(' +
                    'hostname VARCHAR(255) NOT NULL,' +
                    'post_id BIGINT NOT NULL,' +
                    'date VARCHAR(50) NOT NULL,' +
                    'time_stamp VARCHAR(50) NOT NULL,' +
                    'note_count INT NOT NULL,' +
                    "note_delta INT," +
                    'PRIMARY KEY (hostname, post_id, time_stamp),' +
                    'FOREIGN KEY (hostname) REFERENCES Blog(hostname))';

var createTrigger = 'CREATE TRIGGER delta ' +
                    'BEFORE INSERT ON Tracklist ' +
                    'FOR EACH ROW ' +
                    'BEGIN ' +
                    'SET NEW.note_delta = NEW.note_count - (' +
                    'SELECT note_count FROM Tracklist ' +
                    'WHERE hostname=NEW.hostname ' +
                    'AND post_id=NEW.post_id ' +
                    'ORDER BY time_stamp DESC LIMIT 1); ' +
                    'IF NEW.note_delta IS NULL THEN ' +
                    'SET NEW.note_delta = 0; END IF; ' +
                    'END';

    dbserver.query(createBlog, function(err, results) { if (err) throw err;});
    dbserver.query(createTracklist, function(err, results) { if (err) throw err;});
    dbserver.query(createTrigger, function(err, results) { if (err) throw err;});
}

/* Drop tables */
function dropTables(dbserver) {
    dbserver.query('DROP TRIGGER delta', function(err, results) { if (err) console.log("delta trigger already dropped");});
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
        function(err, results) {if (err) console.log(hostname + " already added to db.");});
}

/* Add a new tracking to tracklist */
function addTracklist(dbserver, hostname, post_id, date, note_count) {
    dbserver.query("INSERT INTO Tracklist VALUES('" + hostname + "', '" + post_id + "', '" + date +
                    "', now(), '" + note_count + "', NULL)", 
        function(err, results) {if (err) console.log("Ignore entries that are being duplicated. "+err);});
}

/* Get the most recent trackings and sort by note_delta */
/* Arguement:
        hostname    - if null, return trending of all hostnames
                    - if hostname, return trending of a single hostname
        limit       - if null, return all trackings
                    - if int, return int number of trackings */
function getTrending(dbserver, hostname, limit, cb) {
    var query = "SELECT * FROM Tracklist t1 WHERE time_stamp = " + 
        "(SELECT MAX(time_stamp) from Tracklist t2 WHERE t1.post_id = t2.post_id) ";

    if (hostname) { query += "AND hostname = '" + hostname + "' ";}
    query += "ORDER BY note_delta DESC ";
    if (limit) { query += "LIMIT " + limit; }

    dbserver.query(query, 
        function(err, results) {if (err) throw err; 
            cb(results);});
}

/* Get the most recent trackings and sort by posted date */
/* Arguement:
        hostname    - if null, return trending of all hostnames
                    - if hostname, return trending of a single hostname
        limit       - if null, return all trackings
                    - if int, return int number of trackings */
function getMostRecent(dbserver, hostname, limit, cb) {
    var query = "SELECT * FROM Tracklist t1 WHERE time_stamp = " + 
        "(SELECT MAX(time_stamp) from Tracklist t2 WHERE t1.post_id = t2.post_id) ";

    if (hostname) { query += "AND hostname = '" + hostname + "' ";}
    query += "ORDER BY date DESC ";
    if (limit) { query += "LIMIT " + limit; }

    dbserver.query(query, 
        function(err, results) {if (err) throw err; 
            cb(results);});
}


function test() {
    conn = connect();

    /* test functions */
    // dropTables(conn);
    // createTables(conn);

    // viewAllTables(conn);

    // addBlog(conn, 'firstBlog', '2022-02-30'); // add a new blog
    // viewTableData(conn, 'Blog'); // print blog table to console

    //getTrending(conn, 'qq', 5, printArray);
    //getTrending(conn, 'kddial.tumblr.com', 5, printArray);
    //console.log("12121");
    //getMostRecent(conn, 'kddial.tumblr.com', null, printArray);
    //getTrending(conn, null, null, printArray);

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


