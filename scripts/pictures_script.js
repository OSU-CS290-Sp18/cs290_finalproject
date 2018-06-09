/* Open and close the modal */

var modal = document.getElementById("add-picture-modal");
var backdrop = document.getElementById("modal-backdrop");

function openModal() {
    modal.classList.remove("hidden");
    backdrop.classList.remove("hidden");
}

function closeModal() {
    modal.classList.add("hidden");
    backdrop.classList.add("hidden");
    console.log("test");
}

document.getElementById("add-picture-button").onclick = openModal;

document.getElementById("modal-close-button").onclick = closeModal;


/* Adding a picture */

//var input = document.getElementById("picture-file-input");
var input = document.getElementById("pic-url-input");
var pics = document.getElementById("picture-container");

function addPicture() {

    /*NEED TO UPLOAD PHOTO HERE*/
    
    if(input.value != "") {
        var request = new XMLHttpRequest();
        
        request.open("POST", "uploadPhoto");
        
        var url = input.value;
        
        var obj = {
          url: url  
        };
        
        var req = JSON.stringify(obj);
        
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(req);
        
        closeModal();
    } else {
        alert("No URL provided.");
    }

    /*if (input.files[0] != null) {

        var request = new XMLHttpRequest();
        
        request.open("POST", "uploadPhoto");
        
        request.responseType = "arraybuffer";
        
        var reader = new FileReader();
        
        reader.readAsArrayBuffer(input.files[0]);
        
        var file = reader.result;
        
        var photoObj = {
            photo: file
        };

        var requestBody = JSON.stringify(photoObj);

        request.send(requestBody);
        
        request.send(file);
        
        closeModal();*/
}

document.getElementById("modal-accept-button").onclick = addPicture;
