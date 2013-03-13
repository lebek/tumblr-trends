## tumblr-trends ##

Note: This README is in Markdown language.

Tumblr blog trend tracking system running on:

CDF Environment: ```greywolf```

Port: ```30925```

#### Team members ####
Peter Le Bek - c2lebekp
Kevin Dial - c0dialke
Fahd Ananta - c0ananta

## Usage ##

#### POST /blog - Add a blog post ####

|parameter|description|
|---|---|
| blog | a string indicating a new blog to track by its {base-hostname} |
Response: HTTP status 200 if accepted

#### GET /blog/{base-hostname}/trends - Get trends for a particular blog ####

|parameter|description|
|---|---|
| limit (optional) | the maximum number of results to return |
| order | a string “Trending” or “Recent” |

Response:
```{"trending":[{"url":"http://someurl.com","text":"Some text belonging to the post, if available","image":"http://image-url-from-post.com","date":"2013-03-13 9:15:00 EST","last_track":"2013-03-13 14:20:00 EST","last_count":450,"tracking":[{"timestamp":"2013-03-13 14:20:00 EST","sequence":3,"increment":15,"count":450},{"timestamp":"2013-03-13 13:20:00 EST","sequence":2,"increment":25,"count":435},{"timestamp":"2013-03-13 12:20:00 EST","sequence":1,"increment":10,"count":410}]},{...}],"order":"Trending","limit":10}```

#### GET /blogs/trends - Get all tracked trends ####

| parameter | description |
|---|---|
| limit (optional) | the maximum number of results to return |
| order | a string “Trending” or “Recent” |

Response:
```{"trending":[{"url":"http://someurl.com","text":"Some text belonging to the post, if available","image":"http://image-url-from-post.com","date":"2013-03-13 9:15:00 EST","last_track":"2013-03-13 14:20:00 EST","last_count":450,"tracking":[{"timestamp":"2013-03-13 14:20:00 EST","sequence":3,"increment":15,"count":450},{"timestamp":"2013-03-13 13:20:00 EST","sequence":2,"increment":25,"count":435},{"timestamp":"2013-03-13 12:20:00 EST","sequence":1,"increment":10,"count":410}]},{...}],"order":"Trending","limit":10}```


## How it works ##

#### Server ####

We have the _Server_ and _Database_ modules. The _Server_ invokes an initialization function to connect to the DB, and begin tracking. Each hour the _track_ function is called to update the DB with new likes and posts on all tracked blogs.

The server works by routing and handling requests for three request types (as indicated above in the _Usage_ section). The request handlers make the appropriate function calls to the _Database_ module, retrieves the data, formats the result, and sends the JSON response. The _Database_ module makes querying the DB simple by adding providing wrapper functions for necessary queries.  

#### Database ####

The database schema consists of two tables:
+ Table ```Blog``` to keep a list of blogs we are tracking
+ Table ```Tracklist``` to keep a list of every like from each blog

Each hour, we find all the likes for each blog and insert a new row for every like into the table Tracklist. This will result in multiple rows for every liked post.  To solve this redundancy, we delete the oldest row for each liked post based on the attribute time_stamp.

Each row consists of the following attributes:

| attribute | description |
|---|---|
|*hostname|The blog we are tracking|
|*post_id|The id of the liked post|
|date|The date the liked post was posted|
|*time_stamp|The current time of the insertion|
|note_count|The total note count of the liked post|
|note_delta|The difference between the current total note count and previous total note count|
_* primary key_

Example tables:

	+-------------------+---------------------+
	| Table Blog                              |
	+-------------------+---------------------+
	| hostname          | date_added          |
	+-------------------+---------------------+
	| kd300.tumblr.com  | 2013-03-12 21:00:00 |
	| kddial.tumblr.com | 2013-03-12 21:00:00 |
	+-------------------+---------------------+

	+-------------------+-------------+-------------------------+---------------------+------------+------------+
	| Table Tracklist                                                                                           |
	+-------------------+-------------+-------------------------+---------------------+------------+------------+
	| hostname          | post_id     | date                    | time_stamp          | note_count | note_delta |
	+-------------------+-------------+-------------------------+---------------------+------------+------------+
	| kd300.tumblr.com  | 31935089961 | 2012-09-20 19:41:58 GMT | 2013-03-12 21:00:00 |   12660085 |         23 |
	| kddial.tumblr.com | 45189784396 | 2013-03-12 14:31:59 GMT | 2013-03-12 21:35:29 |        181 |          2 |
	+-------------------+-------------+-------------------------+---------------------+------------+------------+


