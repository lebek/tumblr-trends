/* node packages */
var http = require("http"),
    fs = require("fs"),
    url = require("url"),
    querystring = require("querystring"),
    db = require("./db");

TUMBLR_API_KEY = 'Jpfj8ecNRrHu6b5PSpF8raAbHpQpE3YJeuL3qFYTT8SYbLXmte'

conn = null;

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

init();