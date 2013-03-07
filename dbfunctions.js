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

var createPost = 'CREATE TABLE Post(' +
				'hostname VARCHAR(255) NOT NULL,' +
				'post_id BIGINT NOT NULL,' +
				'PRIMARY KEY (post_id),' +
				'FOREIGN KEY (hostname) REFERENCES Blog(hostname))';

var createTracklist = 'CREATE TABLE Tracklist(' +
					'post_id BIGINT NOT NULL,' +
					'time_stamp VARCHAR(50) NOT NULL,' +
					'note_count INT NOT NULL,' +
					'PRIMARY KEY (post_id, time_stamp),' +
					'FOREIGN KEY (post_id) REFERENCES Post(post_id))'

	dbserver.query(createBlog, function(err, results) { if (err) throw err;});
	dbserver.query(createPost, function(err, results) { if (err) throw err;});
	dbserver.query(createTracklist, function(err, results) { if (err) throw err;});
}

/* Drop tables */
function dropTables(dbserver) {
	dbserver.query('DROP TABLE Tracklist', function(err, results) { if (err) console.log("Tracklist table already dropped");});
	dbserver.query('DROP TABLE Post', function(err, results) { if (err) console.log("Post table already dropped");});
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
function addBlog(dbserver, hostname, date_added) {
	dbserver.query("INSERT INTO Blog VALUES('" + hostname + "', '" + date_added + "')", 
		function(err, results) {if (err) throw err;});
}

/* Add a new post */
function addPost(dbserver, hostname, post_id) {
	dbserver.query("INSERT INTO Post VALUES('" + hostname + "', '" + post_id + "')", 
		function(err, results) {if (err) throw err;});
}


/* export functions */
module.exports.connect = connect;
module.exports.createTables = createTables;
module.exports.dropTables = dropTables;
module.exports.viewAllTables = viewAllTables;
module.exports.viewTableData = viewTableData;
module.exports.addBlog = addBlog;
module.exports.addPost = addPost;
