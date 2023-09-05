const socket = io("https://chat-thread-backend.onrender.com", {
  transports: ["websocket"],
});
const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");

const audio = new Audio("Alert.mp3");

msgerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;

  appendMessage("You", "right", msgText);
  msgerInput.value = "";
  socket.emit("send-message", msgText);
});

function appendMessage(name, side, text) {
  const msgHTML = `
    <div class="msg ${side}-msg">

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date())}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;
  if (side == "left") audio.play();
  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

const userName = window.prompt("Enter your name to join the chat");
socket.emit("new-user-joined", userName);

socket.on("user-joined", (userName) => {
  const text = `Joined the chat`;
  appendMessage(userName, "left", text);
});

socket.on("receive", (data) => {
  appendMessage(data.userName, "left", data.message);
});

socket.on("left-chat", (userName) => {
  appendMessage(userName, "left", "Left the chat");
});
