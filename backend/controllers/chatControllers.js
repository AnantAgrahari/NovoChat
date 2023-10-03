const asyncHandler=require("express-async-handler");
const Chat=require('../models/chatModel');
const User=require('../models/userModel');
const accessChat=asyncHandler(async(req,res)=>{

   const{userId}=req.body;                                                  //this entire code is for 1 to 1 chat only //
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


const fetchChats = asyncHandler(async (req, res) => {
    try {
      Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })      //this is to find all the chats that the logged in user is  a part of // 
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 })
        .then(async (results) => {
          results = await User.populate(results, {
            path: "latestMessage.sender",
            select: "name pic email",
          });
          res.status(200).send(results);
        });
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  });


  const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send({ message: "Please Fill all the feilds" });
    }
  
    var users = JSON.parse(req.body.users);
  
    if (users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }
  
    users.push(req.user);     //req.user is the user that is currently logged in//
  
    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmin: req.user,       //group  admin will be the logged in user himself// 
      });

      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});



const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
  
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName: chatName,
      },
      {
        new: true,             //if this line is not written then it would return the old value of chatname//  
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!updatedChat) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(updatedChat);
    }
  });


  const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
  
    // check if the requester is admin
  
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!added) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(added);
    }
  });


  const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
  
    // check if the requester is admin
  
    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
  
    if (!removed) {
      res.status(404);
      throw new Error("Chat Not Found");
    } else {
      res.json(removed);
    }
  });


module.exports={accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup};