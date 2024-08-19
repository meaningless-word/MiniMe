const chatContainer = document.querySelector(".chat-list");
const messageContainer = document.querySelector(".message-list");
const selectedChatId = document.querySelector("#selected-chat-id");
const authorId = document.querySelector("#author-id");
const formMessageSender = document.querySelector("#message-sender");
const btnShowCreateChatDialog = document.querySelector("#chat-create");
const messageEditor = document.querySelector('textarea[name="text"]');
const formChatCreator = document.querySelector("#chat-creator");
let selectedChat = chatContainer.firstElementChild;
let chatSocket;
// 

// крепление обработчиков нажатия на плашку чата
const chats = chatContainer.children;
for (var i = 0; i < chats.length; ++i) {
  chats[i].addEventListener("click", selectChat);
}

// выделение первого в списке чата для запроса его сообщений
function firstDefault() {
  selectedChat = chatContainer.firstElementChild;
  if (selectedChat) {
    selectedChat.click();
    selectedChat.className = "chat-list_item-selected";
  }
}
firstDefault();

// после назначения выбранного чата, для него открывается WebSocket
function wsOpen() {
  if (selectedChat) {
    if (chatSocket) {chatSocket.close();}

    chatSocket = new WebSocket(
      `ws://${window.location.host}/ws/chat/${selectedChatId.value}/`
    );

    chatSocket.onclose = function(e) {
      console.log(`Код: ${e.code} причина: ${e.reason}/${e.wasClean ? "Соединение закрыто чисто" : "Обрыв соединения"}`);
    }

    chatSocket.onmessage = function(e) {
      const data = JSON.parse(e.data);
      console.log(data);
      switch(data.message.type) {
        case 'message':
          switch(data.message.action) {
            case 'create':
              showMessage(data.message.parcel);
              break;
            case 'delete':
              const message = document.getElementById(`message-id-${data.message.parcel.id}`);
              if (message) {message.remove();}
              break;
          }
          break;
        case 'chat':
          switch (data.message.action) {
            case "create":
                const members = data.message.parcel.members;
                if (members.find((el) => el == authorId.value)) {
                  showChat(data.message.parcel);
                }
              break;
            case "delete":
              const chat = document.getElementById(`chat-list_item-${data.message.parcel.id}`);
              if (chat) {
                chat.remove();
                firstDefault();
              } 
              break;
          }          
          break;
      }
    }
  }
}

// обработчик нажатия на плашку чата
function selectChat() {
  fetch(`/api/message/?chat_id=${this.getAttribute("chat-id")}`)
  .then((response) => response.json())
  .then((messages) => {
    showMessages(messages);
  })
  .catch((error) => console.error("Error:", error));
  selectedChat.className = "chat-list_item";
  selectedChat = this;
  selectedChat.className = "chat-list_item-selected";
  selectedChatId.value = this.getAttribute("chat-id");
  wsOpen();
}
// отображение списка сообщений
function showMessages(messages) {
  messageContainer.innerHTML = "";
  messages.forEach((message) => {
    messageContainer.append(prepareMessage(message));
  });
  messageContainer.scrollTop = messageContainer.clientHeight;
}

// отображение плашки сообщения
function showMessage(message) {
  messageContainer.append(prepareMessage(message));
  messageContainer.scrollTop = messageContainer.clientHeight;
}
// подготовка плашки сообщения
function prepareMessage(m) {
  let message = document.createElement("div");
  message.className = `message-panel ${
    m.author == authorId.value ? "shift" : "unshift"
  }`;
  message.id = `message-id-${m.id}`;

  let messageBox = document.createElement("div");
  messageBox.className = `message-box ${
    m.author == authorId.value ? "own-box" : "another-box"
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
    m.author == authorId.value ? "block" : "none"
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
// удаление сообщения
function deleteMessage(id) {
  const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;
  fetch(`/api/message/${id}/`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    credentials: "include",
  }).then(() => {
    chatSocket.send(
      JSON.stringify({
        type: "message",
        action: "delete",
        parcel: {"id": id},
      })
    );
  });
}
// отправка сообщения
function sendMessage() {
  if (selectedChatId.value.length == 0) {
    alert("Необходмо выбрать чат прежде, чем отправлять сообщение");
  } else {
    const csrfToken = document.querySelector('input[name="csrfmiddlewaretoken"]').value;

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
      chatSocket.send(JSON.stringify({
        type: "message",
        action: "create",
        parcel: json,
      }));
    })
    .catch((error) => console.error("Error:", error));
  }
}

// крепление обрвботчика к сабмиту формы отправки сообщения
formMessageSender.onsubmit = function (ev) {
  sendMessage();
  messageEditor.value = "";
  return false;
};

// крепление обоработчика к кнопке вызова диалога создания чата
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

// крепление обработчика к кнопке удаления чата
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
      const m_attr = chat.getAttribute('members') ?? '';
      const m = m_attr.replaceAll(' ', '').replaceAll('[', '').replaceAll(']', '').split(',');
      chatSocket.send(
        JSON.stringify({
          type: "chat",
          action: "delete",
          parcel: { id: selectedChatId.value, members: m }
        })
      );
    });    
  }   
});

// крепление обрвботчика к кнопке отмены создания чата
document.querySelector("#dialog-box__cancel").addEventListener("click", (ev) => {
  document.querySelector("#create-chat-dialog").classList.add("hidden");
  ev. false;
});

// создания чата
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
    checked.push(authorId.value);

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
      chatSocket.send(
        JSON.stringify({
          type: "chat",
          action: "create",
          parcel: json
        })
      );      
    })
    .catch((error) => console.error("Error:", error));
  }
}

// крепление обработчика к сабмиту формы создания чата
document.querySelector("#dialog-box__ok").addEventListener("click", (ev) => {
  createChat();
  document.querySelector("#create-chat-dialog").classList.add("hidden");
});

// отображение плашки чата
function showChat(chat) {
  const chatElement = document.getElementById(`chat-list_item-${chat.id}`);
  if (!chatElement) {
    const newChat = chatContainer.insertBefore(prepareChat(chat), chatContainer.firstChild);
    newChat.addEventListener("click", selectChat);
    newChat.click();
  } 
}
// подготовка плашки чата
function prepareChat(c) {
  let chatItem = document.createElement("div");
  chatItem.id = `chat-list_item-${c.id}`;
  chatItem.className = "chat-list_item";
  chatItem.setAttribute("chat-id", c.id);
  chatItem.setAttribute("members", `[${c.members_list}]`);
  let chatTitle = document.createElement("h4");
  chatTitle.appendChild(document.createTextNode(c.title));
  chatItem.appendChild(chatTitle);
  return chatItem;
}

messageContainer.addEventListener('keyup', (e) => {
  if (e.ctrlKey && e.keyCode == 13) {
    console.log("Ctrl+Enter");
  }  
});