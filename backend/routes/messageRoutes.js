const express=require('express');
const {protect}=require('../middleware/authMiddleware');
const {sendMessage,allMessages}=require("../controllers/messageControllers")
const router=express.Router();


router.route('/').post(protect,sendMessage)            //In this route protected is used so that only the logged in user can visit this route,not anyone else//
router.route('/:chatId').get(protect,allMessages)       //this route is used to fetch all the messages of one single chat//



module.exports=router;