/* node packages */
var http = require("http"),
    fs = require("fs"),
    url = require("url"),
    querystring = require("querystring"),
    db = require("./db");

var TUMBLR_API_KEY = 'Jpfj8ecNRrHu6b5PSpF8raAbHpQpE3YJeuL3qFYTT8SYbLXmte'

var conn = null;

/* optionally set port using first command line arg, default=30925 */
var args = process.argv.splice(2);
var port = parseInt(args[0]);
if (isNaN(port)) port = 30925;

/* Get all posts liked by base_hostname and insert into database*/
function getLikesAndInsert(base_hostname) {
    var api_url = 'http://api.tumblr.com/v2/blog/' + base_hostname 
                + '/likes?api_key=' + TUMBLR_API_KEY;

    var likes = [];
    var offset = 0;

    /* Tumblr API returns max 20 likes, so we step through until the end */
    function _getLikes(offset) {
        var url = api_url + '&offset=' + offset;

        var req = http.get(url, function(response) {
            var str = '';

            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                some_likes = JSON.parse(str).response.liked_posts;
                likes.push.apply(likes, some_likes);

                if (some_likes.length > 0) {
                    /* Request the next batch of likes */
                    offset += some_likes.length;
                    _getLikes(offset);
                } else {
                    /* Done, so callback */
                    //cb(likes);

                    /* Placed the the insertion of tracklist here because it was causing asynchronous problems */
                    for (var i in likes) { 
                        db.addTracklist(conn, base_hostname, likes[i].id, likes[i].date, likes[i].note_count); 
                    };


                }
            });
        });
    }

    _getLikes(0);
}

/* Callback cb with info about a post */
function getPost(hostname, post_id, cb) {
    var api_url = 'http://api.tumblr.com/v2/blog/' + hostname + '/posts?id=' + post_id 
                + '&api_key=' + TUMBLR_API_KEY;

    var req = http.get(api_url, function(response) {
        var str = '';

        response.on('data', function (chunk) {
            str += chunk;
        });

        response.on('end', function () {
            cb(JSON.parse(str).response.posts[0]);
        });
    });
}

/* Track liked posts for all tracked blogs */
function track() {
    console.log('Tracking...');
    db.viewTableData(conn, 'Blog', function (blogs) { 
        for (var i in blogs) {
            /* Calling addTracklist for every like is now inside the getLikes function */
            getLikesAndInsert(blogs[i].hostname);
        }
    });
}

function init() {
    conn = db.connect();
    db.dropTables(conn);
    db.createTables(conn);

    //db.addBlog(conn, 'blog.zacksultan.com');
    db.addBlog(conn, 'kd300.tumblr.com');
    db.addBlog(conn, 'kddial.tumblr.com');
    
    /* Track once */
    track();

    /* ...and track again every hour */
    setInterval(track, 1*60*1000);
}

http.createServer(function(request, response) {
    var pathname = url.parse(request.url).pathname
    var regex_basehostname = /^.+\/(.+)\//

    /***** HANDLERS *****/
    var handle = {}
    handle["/blog"] = addBlog;
    handle["trends"] = getTrends;
    handle["/blogs/trends"] = getAllTrends;

    /***** ROUTER *****/
    if (typeof handle[pathname] === 'function') {
        console.log("Routing a request for " + pathname);
        handle[pathname](request, response);
    } else if (pathname.match(regex_basehostname) !== null) {
        console.log("Routing a request for " + pathname);
        var base_hostname = pathname.match(regex_basehostname)[1];
        handle["trends"](request, response, base_hostname)
    } else {
        console.log("No request handler found for " + pathname);
        _displayError(response, 404);
    }

    /***** REQUEST HANDLERS *****/
    function addBlog(request, response) {
        var blog_name = request.blog;
        db.addBlog(conn, blog_name)
        _writeHead(response, 200, 'json')
        response.end();
    }

    function getTrends(request, response, base_hostname) {
        var limit = null, order = request.order;
        if (typeof request.limit !== 'null') {
            limit = request.limit
        }

        var getDBFunction;
        if (request.order === 'Recent') {
            DBFunction = getMostRecent
        } else {
            DBFunction = getTrending
        }

        DBFunction(conn, base_hostname, limit, function (result) {
            _writeHead(response, 200, 'json')
            _writeBody(response, JSON.stringify(result);
        });
    }

    function getAllTrends(request, response) {
        var limit = null;
        if (typeof request.limit !== 'null') {
            limit = request.limit
        }

        var getDBFunction;
        if (request.order === 'Recent') {
            DBFunction = getMostRecent
        } else {
            DBFunction = getTrending
        }

        DBFunction(conn, null, limit, function (result) {
            _writeHead(response, 200, 'json')
            _writeBody(response, JSON.stringify(result);
        });
    }

    /***** HELPER FUNCTIONS *****/
    /* error handler */
    function _displayError(response, error_code, error_msg) {
        error_msg = typeof error_msg !== "undefined" ? error_code + " " + error_msg : error_code + " not found";
        _writeHead(response, error_code, 'plain');
        _writeBody(response, error_msg);
    }

    /* helper for response.writeHead */
    function _writeHead(response, html_code, content_type) {
        if (content_type === "plain" || content_type === "html") {
            content_type = "text/" + content_type;
        } else if (content_type === "json" || content_type === "js") {
            content_type = "application/" + content_type;
        } else if (content_type === "png") {
            content_type = "image/" + content_type;
        } else {
            content_type = "text/plain";
        }
        response.writeHead(html_code, {"Content-Type": content_type});
    }

    /* helper for response.write */
    function _writeBody (response, body_content, encoding) {
        encoding = typeof encoding !== "undefined" ? encoding : "utf-8";
        response.write(body_content);
        response.end();
    }

    init();

}).listen(port);
