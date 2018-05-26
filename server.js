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

//CHANGE THIS TO classmongo
var host = "localhost";
//CHANGE THIS TO cs290_lannonh
var dbname = "bookshelf";
//dint change this

var path_base = "./bookshelf";
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

function getObjects(queryObjects, collectionName, callback){
	var objects;
	//array of objects
	var allResults = [];
	MongoClient.connect(mongourl, function(err, client){
		var db = client.db(dbname);
		var collection = db.collection(collectionName);
		objects = [];
		queryObjects.forEach( function (queryObject) {
			collection.find(queryObject).limit(10).toArray(function(err, results){
				if(err){
					console.log("Error finding documents");
					callback(false);
				}
				console.log("THE QUERY ITSELF", queryObject);
				console.log("RESULTS OF QUERY: ", results);
				console.log("TYPE OF QUERY: ", typeof(results));
				allResults.push(results);
			});
		});
	});
	callback(allResults);
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
			regex += (word + "|");
		});
		
		regex = regex.slice(0, regex.length - 1);
		obj[field] = new RegExp(regex, 'i');
		queries.push(obj);
		regex = "";
		obj = {};
	});
	return queries;
}

function requestHandler(req, res){
	//assume status of 200 until something goes wrong
	stat = 200;

	console.log("Request Made");

	//get file type/extension without the period
	var type = path.extname(req.url).replace(/\./, "");
	if(!type){
		type ="html";
	}
	
	//set relative filepath. Set it to bookshelf/index.html if no page is specified
	if(req.url == "/"){
		var filepath = path_base + default_file;
	}else{
		var filepath = path_base + req.url.replace(/\/\?.*/, "");
	}

	var urlObject = new url.parse(req.url, false);

	console.log("query:", urlObject.query);
	console.log("Parsed resource path:", filepath);
	if(urlObject.query){
		res.writeHead(stat, {'Content-Type': 'application/json'});
		getObjects(createQuery(urlObject.query), "bookshelf", function(results){
			//send back the results of database query
			results.forEach( function (element) {
				res.write(JSON.stringify(element));
			});
			res.end();
		});
	}else{
		
		//form path to file. defaults to index.html
		//Read file if not in cache
		if(!(filepath in cache) ){
			//print useful information
			console.log(`received request for ${req.url}`);
			console.log(`received request for ${type} file extension`);
			fs.readFile(filepath, function(err, data) {
				//print error code 
				if(err){console.log(err.code);}
				
				//send 404.html if file requested isn't on FS
				if (err && (err.code == "ENOENT" || err.code == "ENODIR")) {
					stat = 404;
					res.writeHead(stat, {'Content-Type': 'text/html'});
					console.log("404 Page: " , cache['404.html'])
					res.end(cache['404.html']);
				}else{ //read file, store it in cache, and send it over the wire
					console.log("READ FILE => ", data);
					cache[filepath] = data;
					res.writeHead(stat, {'Content-Type': 'text/' + type});
					res.end(data);
				}
			});
		}else{
			//send cached file with 200 status
			res.writeHead(stat, {'Content-Type': 'text/' + type});
			res.end(cache[filepath]);
		}
	}
}


var server = http.createServer(requestHandler);
server.listen(port);
