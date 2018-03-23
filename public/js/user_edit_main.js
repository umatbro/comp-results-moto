document.addEventListener('DOMContentLoaded', () => {
    console.log(`User id:`, USER_ID);

    // delete buttons
    document.querySelectorAll('.delete-track').forEach((trashElem) => {
        trashElem.addEventListener('click', deleteTrack);
    });

    // open modal
    document.querySelector('#add-track').addEventListener('click', showModal);
    document.querySelector('#modal-close').addEventListener('click', hideModal);
    // add new track


    // disqualify
    document.querySelector('#disqualify').addEventListener('click', disqualifyUser);

    // save
    document.querySelector('#save-edit').addEventListener('click', submitForm);
});