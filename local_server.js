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

app.use('/', express.static('.'));

//CHANGE THIS TO classmongo
var host = "localhost";
//CHANGE THIS TO cs290_lannonh
var dbname = "bookshelf";
//dint change this

var path_base = "cs290_finalproject";
var default_file = "/index.html";
var file_ext = "html";

//404.html is always in cache
var cache = {};
fs.readFile("./bookshelf/404.html", function(err, data){
	cache["404.html"] = data;
});

//determine which port to listen to
port = process.env.PORT || 3000;
console.log("using port: ", port);

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

function getFileContents(req, res, filepath){
	var type = path.extname(req.url).replace(/\./, "");
	if(!type){
		type ="html";
	}
	if(!(filepath in cache) ){
		//print useful information
		fs.readFile(filepath, function(err, data) {
			//print error code 
			if(err){console.log(err.code);}
			
			//send 404.html if file requested isn't on FS
			if (err && (err.code == "ENOENT" || err.code == "ENODIR")) {
				res.writeHead(404, {'Content-Type': 'text/html'});
				return cache['404.html'];
			}else{ //read file, store it in cache, and send it over the wire
				console.log("READ FILE => ", filepath,  data);
				cache[filepath] = data;
				res.writeHead(200, {'Content-Type': 'text/' + type});
				return data;
			}
		});
	}else{
		res.writeHead(200, {'Content-Type': 'text/' + type});
		return cache[filepath];
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

app.get('/*.html', (req, res) => res.sendFile(__dirname + "/html" + req.path));
app.get('/*.css', (req, res) => res.sendFile(__dirname + "/css" + req.path));
app.get('/*.js', (req, res) => res.sendFile(__dirname + "/scripts" + req.path));
app.get('/*.jpg', (req, res) => res.sendFile(__dirname + "/images" + req.path));
app.get('/*.png', (req, res) => res.sendFile(__dirname + "/images" + req.path));

app.listen(port);
