## tumblr-trends ##

Note: This README is in Markdown language.

Tumblr blog trend tracking system running on:

CDF Environment: ```greywolf```

Port: ```30925```

## Usage ##

Add a blog post with ```POST /blog```

|parameter|description|
|---|---|
| blog | a string indicating a new blog to track by its {base-hostname} |
Response: HTTP status 200 if accepted

Get trends for a particular blog with ```GET /blog/{base-hostname}/trends```

|parameter|description|
|---|---|
| limit (optional) | the maximum number of results to return |
| order | a string “Trending” or “Recent” |

Response:
```{"trending":[{"url":"http://someurl.com","text":"Some text belonging to the post, if available","image":"http://image-url-from-post.com","date":"2013-03-13 9:15:00 EST","last_track":"2013-03-13 14:20:00 EST","last_count":450,"tracking":[{"timestamp":"2013-03-13 14:20:00 EST","sequence":3,"increment":15,"count":450},{"timestamp":"2013-03-13 13:20:00 EST","sequence":2,"increment":25,"count":435},{"timestamp":"2013-03-13 12:20:00 EST","sequence":1,"increment":10,"count":410}]},{...}],"order":"Trending","limit":10}```

Get all tracked trends with ```GET /blogs/trends```

| parameter | description |
|---|---|
| limit (optional) | the maximum number of results to return |
| order | a string “Trending” or “Recent” |

Response:
```{"trending":[{"url":"http://someurl.com","text":"Some text belonging to the post, if available","image":"http://image-url-from-post.com","date":"2013-03-13 9:15:00 EST","last_track":"2013-03-13 14:20:00 EST","last_count":450,"tracking":[{"timestamp":"2013-03-13 14:20:00 EST","sequence":3,"increment":15,"count":450},{"timestamp":"2013-03-13 13:20:00 EST","sequence":2,"increment":25,"count":435},{"timestamp":"2013-03-13 12:20:00 EST","sequence":1,"increment":10,"count":410}]},{...}],"order":"Trending","limit":10}```




