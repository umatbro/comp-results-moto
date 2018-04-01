const FORM = document.querySelector('#add-user-form');
const CONFIRM_BTN = document.querySelector('#add-user-confirm');

const REQ_HEADERS = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
};


document.addEventListener('DOMContentLoaded', () => {
    FORM.addEventListener('submit', submitForm);
    CONFIRM_BTN.addEventListener('click', submitForm);
});


function submitForm(event) {
    event.preventDefault();
    const name = FORM.name.value;
    fetch('/api/users/', {
        method: 'POST',
        headers: REQ_HEADERS,
        body: JSON.stringify({name}),
    }).then((res) => res.json())
        .then((user) => {
            console.log('User', user);
            document.location.href = `/user/${user.id}/edit`;
        })
        .catch((err) => alert(err));
}