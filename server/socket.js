import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessagesModel.js";

const setupSocket = (server) => {
    const io = new SocketIOServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        }
    });

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`Client Disconnected: ${socket.id}`);
        for (const [userId, socketIds] of userSocketMap.entries()) {
            if (socketIds.has(socket.id)) {
                socketIds.delete(socket.id);
                if (socketIds.size === 0) {
                    userSocketMap.delete(userId);
                }
                break;
            }
        }
    };

    const sendMessage = async (message) => {
        const senderSocketIds = userSocketMap.get(message.sender) || new Set();
        const recipientSocketIds = userSocketMap.get(message.recipient) || new Set();

        const createdMessage = await Message.create(message);
        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email firstName lastName image color")
            .populate("recipient", "id email firstName lastName image color");

        for (const socketId of senderSocketIds) {
            io.to(socketId).emit("receiveMessage", messageData);
        }
        for (const socketId of recipientSocketIds) {
            io.to(socketId).emit("receiveMessage", messageData);
        }
    };

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;

        if (userId) {
            if (!userSocketMap.has(userId)) {
                userSocketMap.set(userId, new Set());
            }
            userSocketMap.get(userId).add(socket.id);
            console.log(`User connected: ${userId} with socket ID: ${socket.id}`);
        } else {
            console.log("User ID not provided during connection.");
        }

        socket.on("sendMessage", sendMessage);
        socket.on("disconnect", () => disconnect(socket));
    });
};

export default setupSocket;
