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

document.getElementById("modal-cancel-button").onclick = closeModal;
document.getElementById("modal-close-button").onclick = closeModal;

/* Adding a picture */

var input = document.getElementById("picture-file-input");
var pics = document.getElementById("picture-container");

function addPicture() {
    if (input.value != "") {
        
        /*NEED TO UPLOAD PHOTO HERE*/
        
        var new_pic = document.createElement("article");

        new_pic.classList.add("picture-frame");

        new_pic.innerHTML = "<img src='" + input.value + "' class='picture'>"

        pics.append(new_pic);
        
        input.value = "";

        closeModal();
    } else {
        alert("No file provided.");
    }
}

document.getElementById("modal-accept-button").onclick = addPicture;
