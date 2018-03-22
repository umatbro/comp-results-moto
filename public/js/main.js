const USER_CARD = document.querySelector('#user-card');
const LOADER = document.querySelector('#loader');


/**
 * Display user data in left navbar
 *
 * @param userData containing name, tracks completed and score
 * @return {Promise<void>}
 */
function displayUserDetails(userData) {
    let {name, score, completedTracks} = userData;
    let nameHeader = USER_CARD.querySelector('.name');
    let scoreHeader = USER_CARD.querySelector('.score');
    let trackTable = USER_CARD.querySelector('table');
    let editLink = USER_CARD.querySelector('.edit-link');

    if (!completedTracks) trackTable.style.display = 'none';
    else trackTable.style.display = 'inline-block';

    trackTable = trackTable.querySelector('tbody');
    while (trackTable.hasChildNodes()) {
        trackTable.removeChild(trackTable.lastChild);
    }
    nameHeader.textContent = name;
    scoreHeader.textContent = score;
    editLink.setAttribute('href', `/user/${userData.id}/edit`);

    completedTracks.forEach((track) => {
        let row = trackTable.insertRow();
        let trackName = row.insertCell(0);
        let points = row.insertCell(1);
        let length = row.insertCell(2);

        trackName.textContent = track.name;
        points.textContent = track.points;
        length.textContent = track.length;
    });
    showUserCard();
}


function showUserCard() {
    USER_CARD.style.display = 'block';
}

function hideUserCard() {
    USER_CARD.style.display = 'none';
}

function showLoader() {
    LOADER.style.display = 'flex';
}

function hideLoader() {
    LOADER.style.display = 'none';
}


document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('#ranking>tbody>tr').forEach((row) => {
        row.addEventListener('click', (event) => {
            hideUserCard();
            showLoader();
            fetch(`/api/users/${row.dataset.userId}`)
                .then((res) => res.json())
                .then((userData) => {
                    hideLoader();
                    displayUserDetails(userData);
                })
                .catch((err) => {
                    hideLoader();
                    alert(err);
                });
        });
    });
});
