import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js';

dotenv.config();

const app = express();

mongoose.connect(process.env.MONGO)
.then(()=>{
    console.log("Database is connected");
}).then((err)=>{
    console.log(err)
})


app.listen(3000,()=>{
    console.log("server run on port number 3000 !")
})

app.use("/api/user",userRoutes)