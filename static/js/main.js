const chatContainer = document.querySelector(".chat-list");
const messageContainer = document.querySelector(".message-list");
const selectedChatId = document.querySelector("#selected-chat-id");
const formMessageSender = document.querySelector("#message-sender");
const btnShowCreateChatDialog = document.querySelector("#chat-create");
const messageEditor = document.querySelector('textarea[name="text"]');
const formChatCreator = document.querySelector("#chat-creator");

const chats = chatContainer.children;
for (var i = 0; i < chats.length; ++i) {
  chats[i].addEventListener("click", selectChat);
}

function selectChat() {
  fetch(`/api/message/?chat_id=${this.getAttribute("chat-id")}`)
    .then((response) => response.json())
    .then((messages) => {
      showMessages(messages);
    })
    .catch((error) => console.error("Error:", error));
  console.log(this.getAttribute("chat-id"));
  selectedChatId.value = this.getAttribute("chat-id");
}

function showMessages(messages) {
  messageContainer.innerHTML = "";
  messages.forEach((message) => {
    messageContainer.append(prepareMessage(message));
  });
  messageContainer.scrollTop = messageContainer.clientHeight;
}

function showMessage(message) {
  messageContainer.append(prepareMessage(message));
  messageContainer.scrollTop = messageContainer.clientHeight;
}

function prepareMessage(m) {
  let message = document.createElement("div");
  message.className = `message-panel ${
    m.author == m.authorizedUser ? "shift" : "unshift"
  }`;
  message.id = `message-id-${m.id}`;

  let messageBox = document.createElement("div");
  messageBox.className = `message-box ${
    m.author == m.authorizedUser ? "own-box" : "another-box"
  }`;

  let author = document.createElement("span");
  author.className = "author-info";
  author.appendChild(document.createTextNode(m.authorName));

  let text = document.createElement("span");
  text.className = "message-text";
  text.appendChild(document.createTextNode(m.text));

  let timeInfo = document.createElement("span");
  timeInfo.className = "time-info";
  timeInfo.appendChild(document.createTextNode(m.dateCreation));
  let buttonDelete = document.createElement("button");
  buttonDelete.className = "tiny-button";
  buttonDelete.style.display = `${
    m.author == m.authorizedUser ? "block" : "none"
  }`;
  buttonDelete.appendChild(document.createTextNode("удалить"));
  buttonDelete.addEventListener("click", () => {
    deleteMessage(m.id);
  });
  timeInfo.appendChild(buttonDelete);

  messageBox.appendChild(author);
  messageBox.appendChild(text);
  messageBox.appendChild(timeInfo);

  message.appendChild(messageBox);
  return message;
}

function deleteMessage(id) {
  const csrfToken = document.querySelector(
    'input[name="csrfmiddlewaretoken"]'
  ).value;
  fetch(`/api/message/${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    credentials: "include",
  }).then(() => {
    const message = document.getElementById(`message-id-${id}`);
    if (message) {message.remove();}
  });
}

function sendMessage() {
  if (selectedChatId.value.length == 0) {
    alert("Необходмо выбрать чат прежде, чем отправлять сообщение");
  } else {
    const csrfToken = document.querySelector(
      'input[name="csrfmiddlewaretoken"]'
    ).value;

    fetch(`/api/message/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({
        text: messageEditor.value,
        author: document.getElementById("author-id").value,
        chat: selectedChatId.value,
        deleted: false,
      }),
    })
    .then((response) => response.json())
    .then((json) => {
      console.log("Message sent:", json);
      showMessage(json);
    })
    .catch((error) => console.error("Error:", error));
  }
}

formMessageSender.onsubmit = function (ev) {
  sendMessage();
  messageEditor.value = "";
  return false;
};

btnShowCreateChatDialog.addEventListener("click", () => {
  fetch(`/api/users`)
  .then((response) => response.json())
  .then((users) => {
    let s = "";
    users.forEach((user) => {
      if (!user.itsMe) {
        s += `<div><input type="checkbox" id="user-${user.id}" name="chbUser" value="${user.username}" />`;
        s += `<label for="user-${user.id}">${user.username}</label></div>`;
      }
      const userList = document.getElementById("user-list");
      userList.innerHTML = s;
    });
  })
  .catch((error) => console.error("Error:", error));
  document.querySelector("#create-chat-dialog").classList.remove("hidden");
});

document.querySelector("#chat-destroy").addEventListener("click", () => {
  if (selectedChatId.value.length == 0) {
    alert("Необходмо выбрать чат прежде, чем удалить его");
  } else {
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
    fetch(`/api/chat/${selectedChatId.value}/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      credentials: "include",
    }).then(() => {
      const chat = document.getElementById(`chat-list_item-${selectedChatId.value}`);
      if (chat) {chat.remove();} 
    });    
  }   
});

document.querySelector("#dialog-box__cancel").addEventListener("click", () => {
  document.querySelector("#create-chat-dialog").classList.add("hidden");
});

function createChat() {
  const chatName = document.querySelector('input[id="chat-title"]').value;
  const checkBoxes = document.getElementsByName("chbUser");
  const checked = [];
  checkBoxes.forEach((item, i) => {
    if (item.checked) {
      checked.push(item.id.replace("user-", ""));
    }
  });
  if (checked.length == 0) {
    alert("Необходимо добавить хотя бы одного собеседника");
  } else if (chatName.length == 0) {
    alert("Необходимо указать наименование");
  } else {
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

    fetch(`/api/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      credentials: "include",
      body: JSON.stringify({
        title: chatName,
        members: checked,
      }),
    })
    .then((response) => response.json())
    .then((json) => {
      console.log("Message sent:", json);
      showChat(json);
    })
    .catch((error) => console.error("Error:", error));
  }
}

formChatCreator.onsubmit = function (ev) {
  createChat();
  document.querySelector("#create-chat-dialog").classList.add("hidden");
  return false;
};

function showChat(chat) {
  const newChat = chatContainer.insertBefore(prepareChat(chat), chatContainer.firstChild);
  newChat.addEventListener("click", selectChat);
}

function prepareChat(c) {
  let chatItem = document.createElement("div");
  chatItem.id = `chat-list_item-${c.id}`;
  chatItem.className = "chat-list_item";
  chatItem.setAttribute("chat-id", c.id);
  let chatTitle = document.createElement("h4");
  chatTitle.appendChild(document.createTextNode(c.title));
  chatItem.appendChild(chatTitle);
  return chatItem;
}
