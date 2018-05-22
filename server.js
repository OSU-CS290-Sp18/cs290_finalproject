/*
 * Author: Hunter Lannon
 * Email: lannonh@oregonstate.edu
 */
var http = require('http');
var fs = require('fs');
var path = require('path');
var url = require('url');

var stat = 200;
var path_base = "./bookshelf";
var default_file = "/index.html";
var file_ext = "";

//404.html is always in cache
var cache = {};
fs.readFile("./public/404.html", function(err, data){
	cache["404.html"] = data;
})

//determine which port to listen to
port = 1337;
console.log("using port: ", port);

function requestHandler(req, res){
	//assume status of 200 until something goes wrong
	stat = 200;

	console.log("Request Made");

	//get file type/extension without the period
	var type = path.extname(req.url).replace(/\./, "");
	if(!type){ type = "html"; }

	//print useful information
	console.log(`received request for ${req.url}`);
	console.log(`received request for ${type} file extension`);
	
	//form path to file. defaults to index.html
	if(req.url == "/"){
		var filepath = path_base + default_file;
	}else{
		var filepath = path_base + req.url;
	}

	//Read file if not in cache
	if(!(filepath in cache) ){
		fs.readFile(filepath, function(err, data) {
			//print error code 
			if(err){console.log(err.code);}
			
			//send 404.html if file requested isn't on FS
			if (err && err.code == "ENOENT") {
				stat = 404;
				res.writeHead(stat, {'Content-Type': 'text/html'});
				res.end(cache['404.html']);
			}else{ //read file, store it in cache, and send it over the wire
				console.log("READ FILE => ", data);
				cache[filepath] = data;
				res.writeHead(stat, {'Content-Type': 'text/' + type});
				res.end(data);
			}
		})
	}else{
		//send cached file with 200 status
		res.writeHead(stat, {'Content-Type': 'text/' + type});
		res.write(cache[filepath]);
		res.end();
	}
}


var server = http.createServer(requestHandler);
server.listen(port);
