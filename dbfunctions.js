/* Print results array to console */
function printArray(results) {
	for (var i=0;i<results.length;i++){
			console.log(results[i]);
	}; 
}

/* Create tables */
function createTables(dbserver) {

var createBlog = 'CREATE TABLE Blog(' +
				'hostname VARCHAR(255) NOT NULL,' +
				'date_added VARCHAR(50) NOT NULL,' +
				'PRIMARY KEY (hostname))';

var createPost = 'CREATE TABLE Post(' +
				'hostname VARCHAR(255) NOT NULL,' +
				'post_id INT NOT NULL,' +
				'url VARCHAR(255),' +
				'date VARCHAR(50),' +
				'image VARCHAR(255),' +
				'text VARCHAR(255),' +
				'PRIMARY KEY (post_id),' +
				'FOREIGN KEY (hostname) REFERENCES Blog(hostname))';

var createTracklist = 'CREATE TABLE Tracklist(' +
					'post_id INT NOT NULL,' +
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
function viewAllTables(dbserver) {
	dbserver.query('SHOW TABLES', function(err, results) {
		if (err) throw err;
		printArray(results);
		return results;
	});
}

/* View all data of a table */
function viewTableData(dbserver, inputTable) {
	dbserver.query('SELECT * FROM ' + inputTable, function(err, results) {
		if (err) throw err;
		printArray(results);
		return results;
	});
}

/* Add a new blog */
function addBlog(dbserver, hostName, date_added) {
	dbserver.query("INSERT INTO Blog VALUES('" + hostName + "', '" + date_added + "')", 
		function(err, results) {if (err) throw err;});
}


/* export functions */
module.exports.createTables = createTables;
module.exports.dropTables = dropTables;
module.exports.viewAllTables = viewAllTables;
module.exports.viewTableData = viewTableData;
module.exports.addBlog = addBlog;
