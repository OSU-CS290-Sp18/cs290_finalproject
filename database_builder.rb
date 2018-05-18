require 'nokogiri'
require 'open-uri'
require 'json'
require 'rest-client'
require 'mongo'


encoding_hash = {
	:invalid => :replace,
	:undef	 => :replace,
	:replace => ''
}

#The lines are formated as TITLE by AUTHOR
def getThousandBooks(url = 'https://www.theguardian.com/books/2009/jan/23/bestbooks-fiction')
	web = Nokogiri::HTML(open(url))
	p = web.css("div.content__article-body p").reverse();
	#remove extra html nodes
	3.times do
		p.pop()
	end
	bookstring = p.to_s
	#remove all remaining html remnants, implicitly returns bookstring
	bookstring = bookstring.split(/<br>/).keep_if do |line|
		!line.index("<")
	end
end

def getAuthors(books)
	#create array of authors from an array of books
	authors = []
	books.each do |line|
		if line.index("by") then
			authors.push(line[line.index("by") + 3, line.length-1])
		end
	end
	return authors
end

def getTitles(books)
	#create an array of titles from an array of books
	titles = []
	books.each do |line|
		if line.index("by") then
			titles.push(line[0,line.index("by")])
		end
	end
	titles.each do |t|
		while t.sub!(/[,.=?]/, "")	
		end
	end
	return titles
end

def myJSONarray(json)
	myjsonarray = []
	json["items"].each do |bookObj|
		begin 
			info = bookObj["volumeInfo"]
			newjson = {
				"authors" => info["authors"],
				"title" => info["title"],
				"isbn_10" => info["industryIdentifiers"][0]["identifier"],
				"isbn_13" => info["industryIdentifiers"][1]["identifier"],
				"description" => info["description"],
				"smallThumbnail" => info["imageLinks"]["smallThumbnail"],
				"largeThumbnail" => info["imageLinks"]["thumbnail"],
				"pageCount" => info["pageCount"],
				"publishDate" => info["publishedDate"]
			}	
		rescue
			newjson = {}
			next
		else
			myjsonarray.push(newjson)
		end
	end
	return myjsonarray
end

#this function makes a call to the google-books api, and returns an array of JSON objects (there might be more than one matching title, 
#author, or whatever else google uses to filter the results
#the JSON object(s) will contain isbn, author, title, genre(s), and an external link to the cover image
#returns the array of JSON objects
def getBookJSONarray(keywords, isbn = '')
	apikey='AIzaSyAQuSJesUQTgWEo4DLm7UqKYZuObsfFQ9s'
	#use keywords if isbn is provided
	if isbn == '' then
		query = (keywords).chomp(" ").downcase
		while query.index(" ") do
			query[" "] = "+"
		end
	else  
		#override title or author parameters when isbn is passed	
		query = "isbn:#{isbn}"
	end
	puts "QUERY IS \"#{query}\""
	fullURL = "https://www.googleapis.com/books/v1/volumes?q=#{query}&key=#{apikey}"
	puts "FULl URL IS: #{fullURL}"
	response = RestClient.get(fullURL, header={})
	body = JSON.parse(response.body)
	#some API responses dont have a body, but have a 200 status code. Bug maybe?
	if body then
		return myJSONarray(body)
	else 
		#failcheck present at call sight to catch this
		return body
	end
end

def main()
	#open up bookshelf collection in bookshelf database
	client = Mongo::Client.new([ 'localhost:27017' ], :database => 'bookshelf')
	collection = client[:bookshelf]
	#gather information from TheGuardian	
	allBooks = getThousandBooks()
	authors = getAuthors(allBooks)
	titles = getTitles(allBooks)

	titles.each do |title|
		puts title
		#remove odd all unicode stuff (had some issues with punctuation)
		books = getBookJSONarray(title.encode(Encoding.find('ASCII'), {
			:invalid => :replace,
			:undef	 => :replace,
			:replace => ''
		}))

		if !books then
			puts "invalid title; #{title}"
		else
			#write first book from google api to mongoDB
			begin
				collection.insert_one(books[0])	
			rescue
				next
			end
		end
	end
end

main()

