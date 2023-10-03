//chat name
//isgroupchat//users//latestmessage//groupadmin(if group chat then only)
const mongoose=require("mongoose");
const chatModel=mongoose.Schema(
    {
        chatName:{type:String,trim:true},   //1 to 1 //
        isGroupChat:{type:Boolean,default:false},
        users:[                                                  //1 to 1//    // this is a array of all chats //
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
            },
        ],
        latestMessage:{                                 //1 to 1//
            type:mongoose.Schema.Types.ObjectId,             //latest message which needs to be displayed on the screen//
            ref:"Message",
        },                 //chatModel means for one single chat,be it 1 to 1 or group//
        groupAdmin:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    },
    {
        timestamps:true,                   //every time a new chat is added//     
    }
);

const Chat=mongoose.model("Chat",chatModel);
module.exports=Chat;