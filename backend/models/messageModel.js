const mongoose=require("mongoose");
const messageModel=mongoose.Schema(                                     //this model is created for =sending the message//
    {
      sender:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
      content:{type:String,trim:true},      //here the content is the message that the sender sends//
      chat:{type:mongoose.Schema.Types.ObjectId,ref:"Chat"},
    },
    {
        timestamps:true,
    }
);
const Message=mongoose.model("Message",messageModel);
module.exports=Message;