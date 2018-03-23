const EDIT_FORM = document.querySelector('#edit-form');
const USER_ID = document.querySelector('#edit-form').dataset.userId;
const ERROR_PANEL = document.querySelector('#error-panel');
const MODAL = document.querySelector('#tracks-modal');
const TRACK_LIST = document.querySelector('#list-of-tracks');

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

function showModal() {
    MODAL.style.display = 'block';
    fetch('/api/tracks')
        .then((res) => res.json())
        .then((tracks) => {
            tracks = tracks.tracks;
            tracks.forEach((track) => {
                let li = document.createElement('li');
                let icon = document.createElement('i');
                icon.setAttribute('class', 'fa fa-plus');
                icon.setAttribute('style', 'margin-right: 3em');
                li.appendChild(icon);
                li.appendChild(document.createTextNode(`${track.name} (${track.points} p.)`));
                li.setAttribute('class', 'w3-hover-text-green c-pointer');
                li.setAttribute('data-track-id', track.id);

                li.addEventListener('click', addTrackToUser);

                TRACK_LIST.appendChild(li);
            });
        })
        .catch((err) => displayError(err.message));
}

function addTrackToUser(event) {
    let id = event.target.dataset.trackId;
    fetch(
        `/api/users/${USER_ID}/add-track`,
        {
            method: 'PUT',
            headers: REQ_HEADERS,
            body: JSON.stringify({id}),
        }
    ).then((res) => location.reload())
        .catch((err) => displayError(err.message));
}

function hideModal() {
    MODAL.style.display = 'none';
}