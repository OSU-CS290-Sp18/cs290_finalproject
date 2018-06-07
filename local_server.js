/*
 * Author: Hunter Lannon
 * Email: lannonh@oregonstate.edu
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
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

app.use('/', express.static('.'));

var host = "localhost";
var dbname = "bookshelf";

//determine which port to listen to
port = 1465;
console.log("using port: ", port);

//string to connect to any database
var mongourl = "mongodb://" + host + ":27017";

function getObjects(req, res, queryObjects, collectionName, callback){
	var objects;
	//array of objects
	let allResults = new Array;
	MongoClient.connect(mongourl, function(err, client){
		var db = client.db(dbname);
		var collection = db.collection(collectionName);
		queryObjects.forEach( function (queryObject, idx) {
			collection.find(queryObject).limit(10).toArray(function(err, results){
				if(err){
					console.log("Error finding documents");
					callback(false);
				}else{
					console.log("THE QUERY ITSELF", queryObject);
					console.log("RESULTS OF QUERY: ", results);
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
		var matchers = substr.split("=")[1].split("+");
		console.log("Field: ", field);
		console.log("Matchers: ", matchers);
		matchers.forEach ( function (word) {
			//remove shit words from query because they match basically everything
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
	console.log("URL OBJECT:", urlObject);
	if(urlObject.query){
		res.writeHead(200, {'Content-Type': 'application/json'});
		getObjects(req, res, createQuery(urlObject.query), getCollection(urlObject.query), function(results){
			//send back the results of database query
			results.forEach( function (element) {
				console.log("Sending Object: ", element);
				res.write(JSON.stringify(element));
			});
		});
	}
});

app.get('/books.html*', function (req, res) {
	MongoClient.connect(mongourl, function(err, client){
		var db = client.db("bookshelf");
		var collection = db.collection("mybooks");
		var allResults = [];
		var context = {books: allResults, quote: "Books, they are on the shelves", person: "Confucious", pagename: "Bookshelf"};
		//if collection exists
		if(collection){
			collection.find({}).toArray(function(err, results){
					results.forEach(function (element){
						allResults.push(element);
					});
					context.books = allResults;
			});		
		}
		hbsInstance.renderView(path.join(__dirname, "templates/", "books.handlebars"), context, function (err, html){
			res.status(200).send(html);		
		});
	});

});

app.delete('/delete_book/:isbn', function (req, res, next){
	console.log("RECIEVED DELETE:", req.url);
	MongoClient.connect(mongourl, function(err, client){
		var db = client.db("bookshelf");
		var collection = db.collection("mybooks");
		collection.deleteOne({isbn_10: req.params.isbn }, {}, function (err, result){
			if(err){
				res.status(204).send("No book found");
			}else{
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
