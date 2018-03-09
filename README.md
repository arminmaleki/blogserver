# Blog CRUD API

A simple blog API for posting and retrieving blog posts. I created it as a programming exercise and demonstration using nodejs and mongodb. It automatically assigns an index to each of your posts which may be used later to retrieve or update them individually. You can also search the blog for a search query.

##to post a post:

post to:
http:// adress:port/
your blog post as a JSON {title:"title",body:"here goes the rest"}
you may use google's Postman (specifying raw and JSON it would automatically set the request header)

##to retrieve posts:

to retrieve all of them as JSON:
get:
http://address:port/

to retrieve all of them as a simple webpage:
http://address:port/web

to retrieve a post by index (as JSON):
http://address:port/by_index/(the index goes here)

to retrieve all posts containing a search query:
http://address:port/search/(search query)

##to delete a post:
send a delete request 

http://address:port/(index of the document)

##to update a post:
send a put request

http://address:port/(index of the document)
and the body as JSON for example {title:"this is the new title"}



