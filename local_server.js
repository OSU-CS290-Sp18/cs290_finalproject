/*
 * Author: Hunter Lannon
 * Email: lannonh@oregonstate.edu
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
var bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var express = require('express');
var exphbs = require("express-handlebars");
var app = express();
var router = express.Router({
    "caseSensitive": true
});
var hbs = require('express-handlebars');
var hbsInstance = hbs.create({
    defaultLayout: 'navbar_only',
    layoutsDir: __dirname + '/views/layouts/'
});
app.engine('handlebars', hbsInstance.engine);
app.set('view engine', 'handlebars');

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use('/', express.static('.'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

var host = "localhost";
var dbname = "bookshelf";

//var host = "classmongo.engr.oregonstate.edu";
//var dbname = "cs290_lannonh";


//determine which port to listen to
port = 1465;
console.log("using port: ", port);

//string to connect to any database
//var mongourl = "mongodb://" + host + ":27017";

const mongourl = "mongodb://cs290_lannonh:bookshelf@" + host + ":27017/?authMechanism=MONGODB-CR&authSource=cs290_lannonh";

function getObjects(req, res, queryObjects, collectionName, callback) {
    var objects;
    //array of objects
    let allResults = new Array;
    MongoClient.connect(mongourl, function (err, client) {
        var db = client.db(dbname);
        var collection = db.collection(collectionName);
        queryObjects.forEach(function (queryObject, idx) {
            collection.find(queryObject).limit(10).toArray(function (err, results) {
                if (err) {
                    console.log("Error finding documents");
                    callback(false);
                } else {
                    console.log("THE QUERY ITSELF", queryObject);
                    console.log("RESULTS OF QUERY: ", results);
                    results.forEach(function (element) {
                        allResults.push(element);
                    });
                    callback(allResults);
                }
                if (idx === queryObjects.length - 1) {
                    res.end();
                }
            });
        });
    });
}

var shitty_words = ["an", "the", "a", "in", "is"];

function getCollection(query) {
    var startindex = query.includes("collection=");
    if (startindex) {
        startindex += "collection=".length - 1;
        let endindex = query.indexOf("&", startindex);
        if (endindex == -1) {
            endindex = query.length;
        }
        var cname = query.slice(startindex, endindex);
        console.log("REQUEST FOR COLLECTION: ", cname);
        return cname;
    } else {
        return "bookshelf"
    }
}
app.get('/', (req, res) => res.sendFile(__dirname + "/index.html"));
app.get('/query', function (req, res) {
    console.log("Parsed resource path:", req.filepath);
    var urlObject = new url.parse(req.url, false);
    console.log("query:", urlObject.query);
    console.log("URL OBJECT:", urlObject);
    if (urlObject.query) {
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        getObjects(req, res, createQuery(urlObject.query), getCollection(urlObject.query), function (results) {
            //send back the results of database query
            results.forEach(function (element) {
                console.log("Sending Object: ", element);
                res.write(JSON.stringify(element));
            });
        });
    }
});

app.get("/photos.html", function (req, res, next) {
    MongoClient.connect(mongourl, {
        useNewUrlParser: true
    }, function (err, client) {
        if (err) {
            console.log(err);
        } else {
            console.log("Photos page connection to DB (" + mongourl + ") established.")
            var db = client.db(dbname);
            var photoCollection = db.collection("userPhotos");
            photoCollection.find().toArray(function (err, photos) {
                if (err) {
                    res.status(500).send("Error fetching photos from DB.");
                    console.log(err);
                } else {
                    console.log(photos);
                    /*var photoSrc = []
                    for(var i = 0 ; i < photos.length ; i++) {
                        console.log(photos[i].photoSrc);
                        photoSrc.push(photos[i].photoSrc);
                    }*/
                    res.status(200).render('picturesPageTemplate', {
                        photos: photos
                    });
                }
            });
        }
    });
});

app.get('/books.html*', function (req, res) {
	MongoClient.connect(mongourl, function(err, client){
		var db = client.db("bookshelf");
		var collection = db.collection("mybooks");
		var allResults = [];
		//if collection exists
		if(collection){
			collection.find({}).toArray(function(err, results){
					results.forEach(function (element){
						allResults.push(element);
					});
					context.books = allResults;
			});		
		}
		var context = {books: allResults, quote: "Books, they are on the shelves", person: "Confucious", page_type: "bookshelf-page", pagename: "Bookshelf"};
		hbsInstance.renderView(path.join(__dirname, "templates/", "books.handlebars"), context, function (err, html){
			res.status(200).send(html);		
		});
	});
});


app.post("/uploadPhoto", function (req, res, next) {
    MongoClient.connect(mongourl, {
        useNewUrlParser: true
    }, function (err, client) {
        if (err) {
            console.log(err);
        } else {
            console.log("Photos page connection to DB (" + mongourl + ") established for upload.")
            var db = client.db(dbname);
            var collection = db.collection("userPhotos");
            var allPhotos = [];
        }
    });

    console.log("Hello");
    //console.log(req.body);

    //var body = JSON.parse(req.body);

    console.log(req.body.photo);
    //console.log(body.photo)
});

app.get('/books.html*', function (req, res) {
    MongoClient.connect(mongourl, function (err, client) {
        var db = client.db("bookshelf");
        var collection = db.collection("mybooks");
        var allResults = [];
        var context = {
            books: allResults,
            quote: "Books, they are on the shelves",
            person: "Confucious",
            pagename: "Bookshelf"
        };
        //if collection exists
        if (collection) {
            collection.find({}).toArray(function (err, results) {
                results.forEach(function (element) {
                    allResults.push(element);
                });
                context.books = allResults;
            });
        }
        hbsInstance.renderView(path.join(__dirname, "templates/", "books.handlebars"), context, function (err, html) {
            res.status(200).send(html);
        });
    });
});

app.delete('/delete_book/:isbn', function (req, res, next) {
    console.log("RECIEVED DELETE:", req.url);
    MongoClient.connect(mongourl, function (err, client) {
        var db = client.db("bookshelf");
        var collection = db.collection("mybooks");
        collection.deleteOne({
            isbn_10: req.params.isbn
        }, {}, function (err, result) {
            if (err) {
                res.status(204).send("No book found");
            } else {
                res.status(200).send(result);
            }
        });
    });
});

app.get('/*.html*', (req, res) => res.sendFile(__dirname + "/html" + req.path));
app.get('/*.css*', (req, res) => res.sendFile(__dirname + "/css" + req.path));
app.get('/*.js*', (req, res) => res.sendFile(__dirname + "/scripts" + req.path));
app.get('/*.jpg*', (req, res) => res.sendFile(__dirname + "/images" + req.path));
app.get('/*.png*', (req, res) => res.sendFile(__dirname + "/images" + req.path));

app.listen(port);
