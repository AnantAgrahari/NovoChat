const asyncHandler=require("express-async-handler");

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
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };


})