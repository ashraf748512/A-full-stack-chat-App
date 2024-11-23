import cookieParser from "cookie-parser"
import cors from 'cors'
import path from "path";
import dotenv from "dotenv"
import express from 'express'
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
dotenv.config()
import { server ,app } from "./lib/socket.js"
import { connectDB } from './lib/mongodb.connet.js'
const PORT=process.env.PORT
const __dirname = path.resolve();

 app.use(express.json())
 app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
 }))
app.use(cookieParser())

app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }


server.listen(PORT,()=>{
    console.log(`app is listening on PORT : ${PORT}`);
    connectDB();
}
)