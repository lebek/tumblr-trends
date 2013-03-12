/* node packages */
var http = require("http"),
    fs = require("fs"),
    url = require("url"),
    querystring = require("querystring"),
    db = require("./db");

TUMBLR_API_KEY = 'Jpfj8ecNRrHu6b5PSpF8raAbHpQpE3YJeuL3qFYTT8SYbLXmte'

conn = null;

/* Callback cb with all posts liked by base_hostname */
function getLikes(base_hostname, cb) {
    var api_url = 'http://api.tumblr.com/v2/blog/' + base_hostname 
                + '/likes?api_key=' + TUMBLR_API_KEY;

    likes = [];
    offset = 0;

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

                if (some_likes.length == 20) {
                    /* Request the next batch of likes */
                    offset += 20;
                    _getLikes(offset);
                } else {
                    /* Done, so callback */
                    cb(likes);
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
            var hostname = blogs[i].hostname;

            getLikes(hostname, function (likes) {
                for (var i in likes) { 
                    db.addTracklist(conn, hostname, likes[i].id, likes[i].date, likes[i].note_count); 
                };
            });
        }
    });
}

function init() {
    conn = db.connect();
    db.dropTables(conn);
    db.createTables(conn);

    //db.addBlog(conn, 'blog.zacksultan.com');
    //db.addBlog(conn, 'kd300.tumblr.com');
    db.addBlog(conn, 'kddial.tumblr.com');
    //db.addBlog(conn, 'ifloodemptylakes.tumblr.com');
    
    /* Track once */
    track();

    /* ...and track again every hour */
    setInterval(track, 1*30*1000);
}

init();