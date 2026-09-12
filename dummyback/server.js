

import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import { Server } from "socket.io";
import http from "http";


import cors from "cors";
const app = express();
const server = http.createServer(app);

const io=new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }   
});
import cookie from "cookie";
io.use(async (socket, next)=>{
    try {
        const token = cookie.parse(socket.handshake.headers.cookie || "").jwt;
        const payload = await jwt.verify(token, "mysecretkey");
        console.log(payload);
        const conversations = await mongoose.connection.db.collection("conversations").find({participants: new mongoose.Types.ObjectId(payload.userId)}).toArray();
        // console.log("--------------------------------")
        // console.log(payload.userId,"is a part of the following conversations: ", conversations.map(el=>el._id.toString()));


        // console.log("--------------------------------")

        const convRooms = conversations.map(el=>el._id.toString());
        convRooms.forEach(conv=>socket.join(`conversation:${conv}`));

        next();
    } catch (error) {
        console.log("Unauthorized");
    }
})

io.on("connection", (socket)=>{
    console.log("Connected: ", socket.id);
    socket.on("disconnect", ()=>{
        console.log("Disconnected: ", socket.id);
    });
});


try {
    await mongoose.connect("mongodb://127.0.0.1:27017/tashifTest");
    console.log("connected!");
} catch (error) {
    console.log(error);
}
// App Error class
// class AppError extends Error{
//     constructor(message, statusCode){
//         super(message);
//         this.statusCode = statusCode;
//         this.isAppError = true;
//     }
// }

// db.conversations.insertMany([
//     {participants: [ObjectId('6a97eec52154dff3947c2907'), ObjectId('6a97eec52154dff3947c2908')]},
//     {participants: [ObjectId('6a97eec52154dff3947c2907'), ObjectId('6a97eec52154dff3947c2909')]}
// ])



// db.messages.insertMany([
//     {
//     content: "Hi",
//     sentBy: ObjectId('6a97eec52154dff3947c2907'),
//     conversationId: ObjectId('6a97f3432154dff3947c290a'),
//     createdAt: Date.now()
//     },
//     {
//     content: "Hello",
//     sentBy: ObjectId('6a97eec52154dff3947c2908'),
//     conversationId: ObjectId('6a97f3432154dff3947c290a'),
//     createdAt: Date.now()+10000
//     },
//     {
//     content: "Hi",
//     sentBy: ObjectId('6a97eec52154dff3947c2909'),
//     conversationId:  ObjectId('6a97f3432154dff3947c290b'),
//     createdAt: Date.now()
//     },
// ])



// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token)
            throw new Error("");
        const payload = await jwt.verify(token, "mysecretkey");
        const users = mongoose.connection.db.collection("users");
        const user = await users.findOne({ _id: new mongoose.Types.ObjectId(payload.userId) });
        // console.log(user);
        if (!user)
            throw new Error("")
        req.user = user;
        next();
    } catch (error) {
        // console.log(error);
        res.status(401).json({ message: "Please login first!" });

    }
}


app.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;
        const users = mongoose.connection.db.collection("users");
        const user = await users.findOne({ email, password });
        console.log(user);
        if (!user)
            return res.status(400).json({ message: "Invalid Credentials!" });
        const token = await jwt.sign({ userId: user._id }, "mysecretkey", { expiresIn: "90d" });
        res.cookie("jwt", token, { maxAge: 1000 * 60 * 60 * 24 * 90 });
        res.status(200).send({ message: "Logged in!" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong!" });
    }
});



app.get("/profile", authenticate, (req, res) => {
    res.status(200).json({ message: req.user });
});

app.get("/inbox", authenticate, async (req, res) => {
    try {

        const conversations = mongoose.connection.db.collection("conversations");

        const inbox = await conversations.aggregate([
            { $match: { participants: req.user._id } },

            {
                $lookup: {
                    from: "users",
                    localField: "participants",
                    foreignField: "_id",
                    as: "participatingUsers"
                }
            },

            {
                $project: {
                    _id: "$_id",
                    participants: {
                        $map: {
                            input: "$participatingUsers",
                            as: "user",
                            in: {
                                _id: "$$user._id",
                                name: "$$user.name"
                            }
                        }
                    }
                }
            },

            {
                $lookup: {
                    from: "messages",
                    localField: "_id",
                    foreignField: "conversationId",
                    as: "messages"
                }
            }
        ]).toArray();

        res.status(200).json({inbox});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong!" });
    }
})

app.get("/logout", (req, res) => {
    res.cookie("jwt", "", { maxAge: 1000 });
    res.status(200).json({ message: "Logged out!" });
});

app.get("/sendMessage/:id", (req, res)=>{
    io.to(`conversation:${req.params.id}`).emit("new_message", "Kya re??");
    res.status(200).json({message: "hmm"})

})

server.listen(8080, ()=>console.log(8080))





// select * from country where continent != "Europe" and population > 20000000 and lifeExpectancy>65;