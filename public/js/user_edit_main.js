document.addEventListener('DOMContentLoaded', () => {
    console.log(`User id:`, USER_ID);

    // delete buttons
    document.querySelectorAll('.delete-track').forEach((trashElem) => {
        trashElem.addEventListener('click', deleteTrack);
    });

    // add new track


    // disqualify
    document.querySelector('#disqualify').addEventListener('click', disqualifyUser);

    // save
    document.querySelector('#save-edit').addEventListener('click', submitForm);
});