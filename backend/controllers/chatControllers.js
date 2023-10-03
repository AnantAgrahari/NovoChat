const asyncHandler=require("express-async-handler");
const Chat=require('../models/chatModel');
const User=require('../models/userModel');
const accessChat=asyncHandler(async(req,res)=>{
    
   const{userId}=req.body;
   if(!userId){
    console.log("userId param not sent with request");
    return res.sendStatus(400); 
   }

   var isChat = await Chat.find({                //isChat is used to find whether chat exist with incoming user or not// 
    isGroupChat: false,  
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },      //current user that is logged in//
      { users: { $elemMatch: { $eq: userId } } },           // new user //
    ],
  })
    .populate("users", "-password")                  //populate is used to join or combine//
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {                 //used to final check whether chat exists or not,bit of extension of upper checking//
    res.send(isChat[0]);
  } else {                                  //if chat not exist then create new chat//
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };


    try {                                                                   // access chat func. is only created,for it to save we have to save it to database//
        const createdChat = await Chat.create(chatData);
        const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(                  //created chat is send to the user//
          "users",
          "-password"
        );
        res.status(200).json(FullChat);
      } catch (error) {
        res.status(400);
        throw new Error(error.message);
      }
    }


});
module.exports={accessChat};