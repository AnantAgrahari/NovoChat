const express = require("express");
const {accessChat,fetchChats,createGroupChat,renameGroup,addToGroup,removeFromGroup} =require('../controllers/chatControllers')
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, accessChat);         //protect middleware makes sure that only logged in user can access this route  //
router.route("/").get(protect, fetchChats);             // get is used to fetch all the chats from the database for that particular user//
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);       //put is used to update the name in the database//
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/groupadd").put(protect, addToGroup);

module.exports = router;