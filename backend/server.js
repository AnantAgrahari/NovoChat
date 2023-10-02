const express =require("express");
const dotenv=require("dotenv");
const { chats }= require("./data/data");
const app=express();
const userRoutes=require('./routes/userRoutes')
const chatRoutes=require('./routes/chatRoutes');
const {notFound,errorHandler}=require("./middleware/errorMiddleware");
dotenv.config();

app.use(express.json());          //to accept json data//
app.get("/",(req,res)=>{
 res.send("api is running");
});

app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes);
app.use(notFound)
app.use(errorHandler)

const PORT=process.env.PORT || 5000;
app.listen(5000,console.log(`server started on port ${PORT}`));
