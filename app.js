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



app.get("/", (req, res)=>{
    res.sendFile(__dirname+"/index.html")
})

app.get("/style.css", (req, res) => {
    res.sendFile(__dirname+"/static/css/style.css")
})

app.get("/script.js", (req, res) => {
    res.sendFile(__dirname+"/static/js/script.js")
})

io.on("connection", (socket) => {
    io.emit("message", "Um usuario entrou.")
    io.emit("users_status", io.engine.clientsCount)
    socket.on("message", (msg)=>{
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