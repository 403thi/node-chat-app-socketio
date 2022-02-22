// configs and imports

// express
const express = require("express")
const app = express()

// http
const http = require("http")
const server = http.createServer(app)

// socket.io
const { Server } = require("socket.io")
const io = new Server(server)
const port = 8080

// public
const path = require("path")
app.use(express.static(path.join(__dirname, "public")))

// routes imports
const chat = require("./routes/chat")

// routes
app.use('/chat', chat)
app.get("/", (req, res)=>{
    res.redirect("/chat")
})

// socket.io
io.on("connection", (socket) => {
    io.emit("message", "Um usuario entrou.")
    io.emit("users_status", io.engine.clientsCount)
    socket.on("message", (msg)=>{
        if (msg.message.length > 1000) {
            socket.emit("message", "[ERRO] Sua é mensagem foi muito longa! Máximo de caracteres: 1000.")
            return
        }
        if (msg.username.length > 64) {
            socket.emit("message", "[ERRO] Seu username é muito longo! Máximo de caracteres: 64.")
            return
        } 
        socket.broadcast.emit("message", `${msg.username}: ${msg.message}`)
    })

    socket.on("disconnect", () => {
        io.emit("message", "Um usuario saiu.")
        io.emit("users_status", io.engine.clientsCount)
    })
})

server.listen(port, ()=>{
    console.log("Express running on http://localhost:"+port)
})