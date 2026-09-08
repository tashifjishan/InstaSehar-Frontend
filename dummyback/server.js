

import express from "express";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";

import cors from "cors";
const app = express();

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

const authenticate = async (req, res, next)=>{
    try {
        const token = req.cookies.jwt;
        if(!token)
            throw new Error("");
        const payload = await jwt.verify(token, "mysecretkey");
        const users = mongoose.connection.db.collection("users");
        const user = await users.findOne({_id: new mongoose.Types.ObjectId(payload.userId)});
        console.log(user);
        if(!user)   
            throw new Error("")
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({message: "Please login first!"});

    }
}


app.post("/login", async (req, res)=>{
    try {
        let {email, password} = req.body;
        const users = mongoose.connection.db.collection("users");
        const user = await users.findOne({email, password});
        console.log(user);
        if(!user)   
            return res.status(400).json({message: "Invalid Credentials!"});
        const token = await jwt.sign({userId: user._id}, "mysecretkey", {expiresIn: "90d"});
        res.cookie("jwt", token, {maxAge: 1000*60*60*24*90, httpOnly: "true", sameSite: "none", secure: true});
        res.status(200).send({message: "Logged in!"});
    } catch (error) {
        console.log(error)
        res.status(500).json({message: "Something went wrong!"});
    }
});



app.get("/profile", authenticate, (req, res)=>{
    res.status(200).json({message: req.user});
});


app.get("/logout", (req, res)=>{
    res.cookie("jwt", "", {maxAge: 1000});
    res.status(200).json({message: "Logged out!"});
})

app.listen(8080, ()=>console.log("http://localhost:8080/"));



