const asyncHandler=require("express-async-handler");
const Message=require('../models/messageModel')
const sendMessage=asyncHandler(async(req,res)=>{

  const {content,chatId}=req.body;
   if(!content && !chatId){                                //in case,if there doesnt exist any chatid and content//
    console.log(
        "Invalid data passed into request"
    );
    return res.sendStatus(400);
   }

   var newMessage={                             //these are the things which the sendMessage controller will have// 
    sender:req.user._id,
    content:content,
    chat:chatId,
   };

   try {
    var message=await Message.create(newMessage);       




   } catch (error) {
    
   }


});
module.exports={sendMessage};