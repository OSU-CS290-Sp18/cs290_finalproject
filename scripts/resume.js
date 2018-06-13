function openEditModal() {
    document.getElementById('modal-backdrop').classList.remove('hidden');
    document.getElementById('edit-resume-modal').classList.remove('hidden');
}

document.getElementById('edit-resume-button').addEventListener('click', openEditModal);

function closeEditModal() {
    document.getElementById('modal-backdrop').classList.add('hidden');
    document.getElementById('edit-resume-modal').classList.add('hidden');
}

document.getElementById('modal-close-button').addEventListener('click', closeEditModal);
document.getElementById('modal-accept-button').addEventListener('click', closeEditModal);