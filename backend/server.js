const express =require("express");
const dotenv=require("dotenv");
const { chats }= require("./data/data");
const app=express();
const userRoutes=require('./routes/userRoutes')

dotenv.config();
app.get("/",(req,res)=>{
 res.send("api is running");
});

app.use('/api/user',userRoutes)

const PORT=process.env.PORT || 5000;
app.listen(5000,console.log(`server started on port ${PORT}`));
