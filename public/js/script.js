var socket = io()

var form = document.getElementById("form")
var input = document.getElementById("input-message")
var username = document.getElementById("username")
var msgsContainer = document.getElementById("messages-container")
var msgsList = document.querySelector(".messages")
var usersOn = document.querySelector(".users-on-count")

function createMessageElement(msg, from_user=false) {
    let div = document.createElement("div")
    let item = document.createElement("li")
    item.textContent = msg
    div.appendChild(item)
    div.className = "messages "+ (from_user === true ? "user-message" : "message")
    msgsList.appendChild(div)
    msgsContainer.scrollTo(0, msgsContainer.scrollHeight)
}

form.addEventListener('submit', (event)=>{ // quando enviar o form
    event.preventDefault() // para prevenir erros
    if (!input.value || !username.value) return // se tiver vazio ele da um return
    socket.emit('message', {
        message: input.value,
        username: username.value
    }) // emite ao socket a mensagem
    createMessageElement(`${input.value}`, true)
    input.value = '' // reseta o valor do input
})

socket.on("message", (msg) => {
    createMessageElement(msg)
})

socket.on("users_status", (status) => {
    usersOn.textContent = status.toString()
})