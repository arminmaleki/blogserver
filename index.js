var express=require ('express');
var bodyParser=require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";


MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var mongo = db.db("senfonicoblog");
    //creates blogposts collection and search index
    //if (!mongo.getCollection("blogposts").exists())
     mongo.collection("blogposts").ensureIndex({title:"text",body:"text"});
    //if no counter is set up sets up a counter and puts number of posts 0
    mongo.collection("counters").findOne({},function(err,res){
	if (err) throw err;
	console.log(res);
	if (!res) {
	    console.log("creating post counter");
	    mongo.collection("counters").save({name:"blogposts",value:0},
					      function(err,res){
						  if (err) throw err;
						  console.log("post counter created");
						  
					      });
	}
    });
});

app=express();
app.listen(3000);
app.use(bodyParser());
app.post('/',function(req,result){
    console.log('here is a post');
    console.log(req.body);
    console.log(req.body.title);
    console.log(req.body.body);
// Checking to see if everything is there...    
    if (req.body.title && req.body.body){
	var blogpost={};
	blogpost.title=req.body.title;
	blogpost.body=req.body.body;
	
	MongoClient.connect(url,function(err,db){
	    var mongo=db.db("senfonicoblog");
	    // increments the number of documents
	    mongo.collection("counters").updateOne({name:"blogposts"},{$inc:{value:1}},function(err,res){
		if (err) throw err;
		console.log("counter updated");
		//gets and assign the index of current blogpost
		mongo.collection("counters").findOne({name:"blogposts"},function(err,res){
		    if (err) throw err;
		    console.log("documents: "+res.name+" "+res.value);
		    blogpost.index=res.value;
		    //save the post in the database
		    mongo.collection("blogposts").save(blogpost,function(err,res){
			if (err) throw err;
			result.send('Your post is registered with index '+blogpost.index+'.Done.');
			db.close();
			
		    });
		});
	    });
	   
	    
	   
	});

    } else {result.send('Incomplete request');}
});
app.get('/',function(req,result){
    console.log('get request');
    MongoClient.connect(url,function(err,db){
	if (err) throw err;
	var mongo=db.db("senfonicoblog");
	mongo.collection("blogposts").find({}).toArray(function(err,docs){
	    if (err) throw err;
	    console.log("posts");
	    console.log(docs);
	    result.send(docs);
	    db.close();
	});
	
    });

});
function towebpage(docs){
    var s="";
    //console.log(docs);
    docs.forEach(function(post){
	console.log(post);
	s+="<h1>"+post.title+"</h1>";
	s+="<p>"+post.body+"</p>";
    });
    return s;
}
app.get('/web',function(req,result){
    console.log('get request');
    MongoClient.connect(url,function(err,db){
	if (err) throw err;
	var mongo=db.db("senfonicoblog");
	mongo.collection("blogposts").find({}).toArray(function(err,docs){
	    if (err) throw err;
	    console.log("posts");
	    //console.log(docs);
	    var s=towebpage(docs);
	    result.send(s);
	    db.close();
	});
	
    });

});
app.get('/by_index/:index',function(req,result){
    console.log('get by ID request');
    console.log(req.params.index);
    MongoClient.connect(url,function(err,db){
	if (err) throw err;
	var mongo=db.db("senfonicoblog");
	mongo.collection("blogposts").findOne({index:1*req.params.index},function(err,res){
	    if (err) throw err;
	    console.log("single post");
	    console.log(res);
	    result.send(res);
	    db.close();
	});
	
    });
});
app.get('/search/:term',function(req,result){
    console.log('get by search');
    console.log(req.params.term);
    //if (!req.params.index) {result.send("provide an index!"); return;}
    MongoClient.connect(url,function(err,db){
	if (err) throw err;
	var mongo=db.db("senfonicoblog");
	mongo.collection("blogposts").find({$text:{$search:req.params.term}}).toArray(function(err,res){
	    if (err) throw err;
	    console.log("single post");
	    console.log(res);
	    result.send(res);
	    db.close();
	});
	
    });
});
app.delete('/:index',function(req,result){
    console.log('deleting a post');
    console.log(req.params.index);
    MongoClient.connect(url,function(err,db){
	if (err) throw err;
	var mongo=db.db("senfonicoblog");
	mongo.collection("blogposts").deleteOne({index:1*req.params.index});
	result.send("document deleted");

	
    });
});
app.put('/:index',function(req,result){
    console.log('updating a post');
    console.log(req.params.index);
    console.log(req.body);
    var blogpost={};
    
    if (req.body.title) blogpost.title=req.body.title;
    if (req.body.body) blogpost.body=req.body.body;
    if (!blogpost.title && !blogpost.body) {result.send('bad request');return;}
    
    MongoClient.connect(url,function(err,db){
	if (err) throw err;
	var mongo=db.db("senfonicoblog");
	mongo.collection("blogposts").updateOne({index:1*req.params.index},{$set:blogpost}
						,function(err,res){
						    if (err) throw err;
						    // console.log(res.matchedCount);
						    if (res.matchedCount==1){
							console.log("document updated");
							result.send("document updated");
							
						    }
						    else{
							console.log("document not found");
							result.send("document not found");
						    }
						    db.close();
						});
	
    });
});
console.log('server started');
