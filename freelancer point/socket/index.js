import { Server } from 'socket.io'

const io = new Server(8900,{
    cors : {
        origin: "http://localhost:3000"
    } 
})

let users = []

const addUser = (userId,socketId) => {
    !users.some(user => user.userId === userId) &&
    users.push({userId,socketId})
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find(user => user.userId === userId)
}

io.on("connection",(socket) => {
    console.log("user connected");
    
    io.emit("welcome","hellow word")
    socket.on("addUser", (userId) => {        
        addUser(userId,socket.id)
        io.emit("getUsers",users)
    })

    socket.on("sendMessage",(data) => {
        const user = getUser(data.receiverId)
        console.log("user connected" , users)
        io.to(user.socketId).emit("getMessage",{
            userId : data.userId,
            desc : data.desc
        })
    })

    socket.on("disconnect",() => {
        console.log("user disconnection");
        removeUser(socket.id)
        io.emit("getUsers",users)
    })
})