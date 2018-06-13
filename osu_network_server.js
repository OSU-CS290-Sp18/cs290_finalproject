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
var app = express();
var router = express.Router({
	"caseSensitive" : true
});
var hbs = require('express-handlebars');
var hbsInstance = hbs.create({
	defaultLayout: 'navbar_only',
	layoutsDir: __dirname + '/views/layouts/'}
);
app.engine('handlebars', hbsInstance.engine);
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));

// parse application/json
app.use(bodyParser.json());

app.use('/', express.static('.'));

var host = "classmongo.engr.oregonstate.edu";
var dbname = "cs290_lannonh";
var bodyParser = require('body-parser')

app.use(bodyParser());
app.use(bodyParser.json());
//determine which port to listen to
port = 1465;
console.log("using port: ", port);

const mongourl = "mongodb://cs290_lannonh:bookshelf@" + host + ":27017/?authMechanism=MONGODB-CR&authSource=cs290_lannonh";

function getObjects(req, res, queryObjects, collectionName, callback){
	var objects;
	//array of objects
	let allResults = new Array;
	MongoClient.connect(mongourl, function(err, client){
		if(err){
		console.log("Error Connecting: ", err);
		}
		var db = client.db(dbname);
		var collection = db.collection(collectionName);
		queryObjects.forEach( function (queryObject, idx) {
			collection.find(queryObject).limit(10).toArray(function(err, results){
				if(err){
					console.log("Error finding documents");
					callback(false);
				}else{
					console.log("THE QUERY ITSELF", queryObject);
					results.forEach(function (element){
						allResults.push(element);
					});
					callback(allResults);
				}		
				if (idx === queryObjects.length - 1){
					res.end();
				}
			});
		});
	});
}

var shitty_words = ["an", "the", "a", "in", "is"];

function createQuery(str){
	//separate variabels in string
	var variables = str.split("&");
	var queries = [];
	var regex = "";
	variables.forEach( function (substr) {
		var obj = {};
		var field = substr.split("=")[0];
		console.log("Field: ", field);
		var matchers = substr.split("=")[1].split("+");
		console.log("Matchers: ", matchers);
		matchers.forEach ( function (word) {
			if(!shitty_words.includes(word)){
				regex += (word + "|");
			}	
		});
		
		regex = regex.slice(0, regex.length - 1);
		obj[field] = new RegExp(regex, 'i');
		queries.push(obj);
		regex = "";
		obj = {};
	});
	return queries;
}

function getCollection(query){
	var startindex = query.includes("collection=");
	if( startindex ){
		startindex += "collection=".length - 1;
		let endindex = query.indexOf("&", startindex);
		if(endindex == -1){
			endindex = query.length;
		}
		var cname = query.slice(startindex, endindex);
		console.log("REQUEST FOR COLLECTION: ", cname);
		return cname;
	}
	else{
		return "bookshelf"
	}
}


app.get('/', (req, res) => res.sendFile(__dirname + "/index.html"));
app.get('/query', function (req, res) {
	console.log("Parsed resource path:", req.filepath);
	var urlObject = new url.parse(req.url, false);
	console.log("query:", urlObject.query);
	if(urlObject.query){
		res.writeHead(200, {'Content-Type': 'application/json'});
		getObjects(req, res, createQuery(urlObject.query), getCollection(urlObject.query), function(results){
			//send back the results of database query
			res.write(JSON.stringify(results));
		});
	}
});

app.post('/mybooks*', function (req,res){
	console.log("POST");
	MongoClient.connect(mongourl, function(err, client){
		if(err){
			console.log(err);
		}
		var db = client.db("cs290_lannonh");
		var collection = db.collection("mybooks");
		console.log("Valid collection");
		console.log("object: ", req.body);
		collection.insert(req.body,  function(err, results){
			if(err){
				console.log(err);
			}
			console.log("INSERT RESULTS", results);

			res.status(200).send("Document inserted!");
		});
		
	});
});
app.get('/books.html*', function (req, res) {
	var context = {};
	MongoClient.connect(mongourl, function(err, client){
		if(err){
			console.log(err);
		}
		var db = client.db("cs290_lannonh");
		var collection = db.collection("mybooks");
		var allResults = [];
		if(collection){
			console.log("Valid collection");
			collection.find({}).toArray(function(err, results){
				results.forEach(function (element){
					allResults.push(element);
				});
				var context = {books: allResults, quote: "Books, they are on the shelves", person: "Confucious", page_type: "bookshelf-page", pagename: "Bookshelf"};
				hbsInstance.renderView(path.join(__dirname, "templates/", "books.handlebars"), context, function (err, html){
					res.status(200).send(html);		
				});
				if(err){
					console.log(err);
				}
			});		
		}else{
			hbsInstance.renderView(path.join(__dirname, "templates/", "books.handlebars"), context, function (err, html){
				res.status(200).send(html);		
			});
		}
	});
});
app.delete('/delete_book/:isbn', function (req, res, next){
	console.log("RECIEVED DELETE:", req.url);
	MongoClient.connect(mongourl, function(err, client){
		var db = client.db("cs290_lannonh");
		var collection = db.collection("mybooks");
		var allResults = [];
		collection.deleteOne({isbn_10: req.params.isbn }, {}, function (err, result){
			if(err){
				res.status(204).send("No book found");
	}else{
				res.status(200).send(result);
			}
		});		
	});
});

/**************************************/

app.get("/photos.html*", function (req, res, next) {
    MongoClient.connect(mongourl, {
        useNewUrlParser: true
    }, function (err, client) {
        if (err) {
            console.log(err);
        } else {
            console.log("Photos page connection to DB (" + mongourl + ") established.");
            var db = client.db(dbname);
            var photoCollection = db.collection("userPhotos");

            photoCollection.find().toArray(function (err, photos) {
                if (err) {
                    res.status(500).send("Error fetching photos from DB.");
                    console.log(err);
                } else {
                    res.status(200).render('picturesPageTemplate', {
                        photos: photos, layout: "pictures_layout" 
                    });
                }
            });
        }
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
            
            console.log("URL to be added:" + req.body.url);
            
            collection.insertOne({photoSrc: req.body.url});
        }
    });
});

/**************************************/

app.get('/resume.html', function (req, res, next) {
	MongoClient.connect(mongourl, {
        useNewUrlParser: true
    }, function (err, client) {
        if (err) {
            console.log(err);
        } else {
            console.log("Resume page connection to DB (" + mongourl + ") established.");
            var db = client.db(dbname);
			var resumeCollection = db.collection("resume");

            resumeCollection.find().toArray(function (err, resumeData) {
                if (err) {
                    res.status(500).send("Error fetching resume from DB.");
                    console.log(err);
                } else {
					var resume = resumeData[0];
                    var experience = resume.experience;
					var education = resume.education;
					var skills = resume.skills;
					res.status(200).render('resumePage', {
						layout: 'resume_main',

						experience: experience,
						yearBegin: experience.yearBegin,
						yearEnd: experience.yearEnd,
						job: experience.job,
						jobDuties: experience.jobDuties,

						education: education,
						yearGraduated: education.yearGraduated,
						degree: education.degree,
						major: education.major,
						school: education.school,
						schoolCity: education.school,
						schoolState: education.schoolState,

						skills: skills 
                    });
                }
            });
        }
    });	
});

app.get('/*.html*', (req, res) => res.sendFile(__dirname + "/html" + req.path));
app.get('/*.hb*', (req, res) => res.sendFile(__dirname + "/compiled" + req.path));
app.get('/*.css*', (req, res) => res.sendFile(__dirname + "/css" + req.path));
app.get('/*.js*', (req, res) => res.sendFile(__dirname + "/scripts" + req.path));
app.get('/*.jpg*', (req, res) => res.sendFile(__dirname + "/images" + req.path));
app.get('/*.png*', (req, res) => res.sendFile(__dirname + "/images" + req.path));

app.listen(port);
