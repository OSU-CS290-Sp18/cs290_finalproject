var books;
var currentBooks = [];
var globalIndex = 0;
var globalBook = {};
var context;
var request = new XMLHttpRequest();
var bookrequest = new XMLHttpRequest();
var modal_backdrop = document.querySelector("#modal-backdrop");
var modal = document.querySelector("#add-book-modal");
var modal_button = document.querySelector(".add-book-button");
var quote_add_button = document.getElementById("quote-add-button");
var search_bar = document.querySelector("input.book-search");
var description_box = document.querySelector("#book-description");
var cancellerChancellors = [document.querySelector(".modal-cancel-button")];
var quotes = [];
var ratingpb = document.querySelector("#plus-button");
var ratingmb = document.querySelector("#minus-button");
var addBookButton = document.querySelector(".modal-accept-button");
var rating = 1;

function finishLoading(){
	Handlebars.registerPartial("sEarch_result", "{{search}}")
	var books = document.querySelectorAll(".book p.book-description");

	for(var i = 0; i < books.length; i++){
		if(books[i].innerText.length > 600){
		}
	}
	books = document.querySelectorAll("article.book");
	books.forEach(function (book){
		var deleteButton = book.querySelector(".delete-button");
		deleteButton.addEventListener('click', function (){
			request.open("DELETE", "http://localhost:1465/delete_book/" + book.id, false);
			request.send();	
			window.location.reload();
		});
	});
}

function toggleModal(){
	if(modal.classList.contains("hidden")){
		modal.classList.remove("hidden");
		modal_backdrop.classList.remove("hidden");
	}else{
		modal_backdrop.classList.add("hidden");
		modal.classList.add("hidden"); }
}

function requestBooks(){
	var tokens = search_bar.value.replace(" ", "+");
	let url = "http://localhost:1465/query?collection=bookshelf&" + "title=" + tokens;
	bookrequest.open("GET", url); 
	bookrequest.send();
	
}


function display(){
	var i = this.id;
	globalBook = currentBooks[i];
	search_bar.value = currentBooks[i].title + " Written by " + currentBooks[i].authors;
	description_box.value = currentBooks[i].description;
	description_box.select();
}

function addSearchItem(html, index){
	var list = document.querySelector(".results");
	var newItem = document.createElement("li");
	newItem.addEventListener("click", display);
	newItem.id=index;
	newItem.innerHTML = html;
	list.appendChild(newItem);
}

function clearSearch(){
	var list = document.querySelector(".results");
	list.innerHTML = "";
	currentBooks = [];
}

function hideSearch(){
	var list = document.querySelector(".results");
	list.innerHTML = "";
}

function update_search(){
	context=this.responseText.slice(2);
	context=JSON.parse(context);
	clearSearch();
	for(var i = 0; i < context.length && i < 9; i++){
		var html=Handlebars.templates.search(context[i]);
		currentBooks.push(context[i]);
		addSearchItem(html, i);
	}
}

function reload(){
	for(var i = 0; i < currentBooks.length; i++){
		var html=Handlebars.templates.search(currentBooks[i]);
		addSearchItem(html, i);
	}
}

function clearModal(){
	search_bar.value = "";
	toggleModal();
}

document.addEventListener("DOMContentLoaded", finishLoading);
cancellerChancellors.forEach(function (item){
	item.addEventListener("click", clearModal);
});



function addNewQuote(){
	var list = document.querySelector(".added-quotes");
	var newItem = document.createElement("li");
	var text = document.querySelector("#quote-text").value;
	var quoter = document.querySelector("#quote-by").value;
	newItem.innerHTML = Handlebars.templates.quote({quote: text, person: quoter});
	list.appendChild(newItem);
	quotes.push({quote: text, person: quoter});
}

function plus(){
	var img = document.getElementById("modal-rating");
	if(rating < 5){
		rating+=1;
		img.src="rating_" + rating + ".png";
	}
}

function minus(){
	var img = document.getElementById("modal-rating");
	if(rating > 1){
		rating-=1;
		img.src="rating_" + rating + ".png";
	}
}

function addBook(){
	var req = new XMLHttpRequest;
	req.open("POST", "http://localhost:1465/mybooks", false);
	globalBook["quotes"] = quotes;
	globalBook["rating"] = rating;
	req.setRequestHeader("Content-Type", "application/json");
	req.send(JSON.stringify(globalBook));
	window.location.reload();
}

addBookButton.addEventListener("click", addBook);
ratingpb.addEventListener("click", plus);
ratingmb.addEventListener("click", minus);
quote_add_button.addEventListener("click", addNewQuote);
search_bar.addEventListener("input", requestBooks);
modal.addEventListener("click", hideSearch);
search_bar.addEventListener("focus", reload);
bookrequest.addEventListener("load", update_search);
modal_button.addEventListener("click", toggleModal);
