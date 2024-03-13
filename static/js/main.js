const chatContainer = document.getElementById('chat-list');
const messageContainer = document.getElementById('message-side');
const selectedChatId = document.getElementById('selected-chat-id');
const formMessageSender = document.getElementById("message-sender");
const messageEditor = document.querySelector('textarea[name="text"]')
const btnCreateChat = document.querySelector('.j-btn-create')

function selectChat() {
    fetch(`/api/message/?chat_id=${this.getAttribute('chat-id')}`)
    .then(response => response.json())
    .then(messages => {
        showMessages(messages);
    })
    .catch(error => console.error('Error:', error));
    console.log(this.getAttribute('chat-id'));
    selectedChatId.value = this.getAttribute('chat-id');
}

function showMessages(messages) {
    let s = '';
    messages.forEach(message => {
        s += prepareMessage(message);
    });
    messageContainer.innerHTML = s;
}

function showMessage(message) {
    let s = prepareMessage(message);
    messageContainer.innerHTML += s;
    messageEditor.value = '';
}

function prepareMessage(m) {
    let s = '';
    s += `<div class="row justify-content-${m.author == m.authorizedUser ? 'end' : 'start'}" id="message-id-${m.id}">`;
    s += `<div class="col-lg-8 dialog-box ${m.author == m.authorizedUser ? 'own-box' : 'another-box'}">`;
    s += `<span class="author-info">${m.authorName}</span>`;
    s += `<span>${m.text}</span>`;
    s += `<span class="time-info">`;
    s += `${m.dateCreation}`;
    s += `<button class="action" style="display:${m.author == m.authorizedUser ? 'block' : 'none'}" onclick=deleteMessage(${m.id})>удалить</button>`;
    s += `</span>`;
    s += `</div>`;
    s += `</div>`;
    return s;
}

function deleteMessage(id) {
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    fetch(`/api/message/${id}/`, {
        method: 'DELETE', 
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
        },    
        credentials: "include",
    })
    .then(() => document.getElementById(`message-id-${id}`).style.display = 'none');
}

function sendMessage() {
    if (selectedChatId.value.length == 0) {
        alert("Необходмо выбрать чат прежде, чем отправлять сообщение");
    }
    else {
        const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

        fetch(`/api/message/`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfToken,
            },
            credentials: "include",
            body: JSON.stringify({
                text: messageEditor.value,
                author: document.getElementById('author-id').value,
                chat: selectedChatId.value,
                deleted: false
            }),
        })
        .then(response => response.json())
        .then(json => {
            console.log('Message sent:', json);
            showMessage(json);
        })
        .catch(error => console.error('Error:', error));
    }
}

const chats = chatContainer.children;
for (var i = 0; i < chats.length; ++i) {
    chats[i].addEventListener('click', selectChat);
}

formMessageSender.onsubmit = function(ev) { sendMessage(); return false; }

btnCreateChat.addEventListener('click', () => {
    fetch(`/api/users`)
    .then(response => response.json())
    .then(users => {
        let s = '';
        users.forEach(user => {
            if (!user.itsMe) {
                s += `<div><input type="checkbox" id="user-${user.id}" name="chbUser" value="${user.username}" />`;
                s += `<label for="user-${user.id}">${user.username}</label></div>`;
            }
            const userList = document.getElementById('user-list');
            userList.innerHTML = s;
        });
    })
    .catch(error => console.error('Error:', error));
    document.getElementById('create-chat-dialog').style.display = "inline-block";
});