

function deleteTrack(event) {
    console.log(event.target.dataset.trackId);
}

document.addEventListener('DOMContentLoaded', () => {
    // delete buttons
    document.querySelectorAll('.delete-track').forEach((trashElem) => {
        trashElem.addEventListener('click', deleteTrack);
    });

    // add new track


    // disqualify

    // save
    document.querySelector('#save-edit').addEventListener('click', submitForm);
});