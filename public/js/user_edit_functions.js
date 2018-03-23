const EDIT_FORM = document.querySelector('#edit-form');
const USER_ID = document.querySelector('#edit-form').dataset.userId;
const ERROR_PANEL = document.querySelector('#error-panel');

const REQ_HEADERS = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
};

function submitForm() {
    let name = EDIT_FORM.name.value;
    if (!name) return displayError('You have to provide a name!');
    fetch(
        `/api/users/${USER_ID}/name`,
        {
            method: 'PUT',
            headers: REQ_HEADERS,
            body: JSON.stringify({name}),
        }).then((res) => location.reload())
        .catch((err) => displayError(err.message));
}

function disqualifyUser(event) {
    let shouldBeDisqualified =
        document.querySelector('#disqualify>i').classList.contains('fa-ban');
    fetch(
        `/api/users/${USER_ID}/disqualify`,
        {
            method: 'PUT',
            headers: REQ_HEADERS,
            body: JSON.stringify({disqualified: shouldBeDisqualified})
        }).then((res) => location.reload())
        .catch((err) => displayError(err.message));
}


function deleteTrack(event) {
    console.log('deletin');
    let trackId = event.target.dataset.trackId;
    fetch(
        `/api/users/${USER_ID}/remove-track`,
        {
            method: 'PUT',
            headers: REQ_HEADERS,
            body: JSON.stringify({id: trackId}),
        }).then((user) => location.reload())
        .catch((err) => displayError(err.message));
}

function displayError(errMsg) {
    ERROR_PANEL.style.display = 'block';
    ERROR_PANEL.querySelector('#error-text').textContent = errMsg;
}
