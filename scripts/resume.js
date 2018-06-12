var editResumeButton = document.getElementById('edit-resume-button');
editResumeButton.addEventListener('click', function() {
    document.getElementById('modal-backdrop').classList.remove('hidden');
    document.getElementById('edit-resume-modal').classList.remove('hidden');
});