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
}

document.getElementById("add-picture-button").onclick = openModal;

document.getElementById("modal-cancel-button").onclick = closeModal;
document.getElementById("modal-close-button").onclick = closeModal;