import React, { useState } from 'react';
import { ChatState } from '../Context/ChatProvider';
import {Box,Text} from "@chakra-ui/layout";
import { ArrowBackIcon } from '@chakra-ui/icons';
import {getSender, getSenderFull} from "../config/ChatLogics";
import {IconButton} from "@chakra-ui/button";
import ProfileModal from "./Authentication/miscellaneous/ProfileModal";
import UpdateGroupChatModal from './Authentication/miscellaneous/UpdateGroupChatModal';
import {FormControl, Spinner} from "@chakra-ui/react"
import { sendMessage } from '../../../backend/controllers/messageControllers';
import axios from "axios";

const SingleChat = ({fetchAgain,setFetchAgain}) => {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
const {user,selectedChat,setSelectedChat}=ChatState();
     const toast=useToast();

const sendMessage=async(event)=>{
    if(event.key==="Enter" && newMessage)                  //if the pressed key is enter and new message is present thenn only this block will execute//  
    {
      try {
        const config={
          headers:{
            "Content-Type":"application/json",
            Authorization:`Bearer ${user.token}`,
          },
        };
        const {data}=await axios.post(
          "/api/message",
          {
            content:newMessage,
            chatId:selectedChat._id,
          },
          config
        );
        setNewMessage("");
        setMessages([...messages,data]);             //this is used to append or add the new message over the existing messages//
         
      } catch (error) {
        toast({
          title:"error occured",
          description:"failed to send the message",
          status:"error",
          duration:5000,
          isClosable:true,
          position:"bottom",
        });
      }
    }
};


const typingHandler=(e)=>{
  setNewMessage(e.target.value);


  //typing indicator logic//
};

  return (
    <>
    {selectedChat ?(
        <>
        <Text
        fontSize={{base:"28px",md:"30px"}}
        pb={3}
        px={2}
        w="100%"
        fontFamily="Work sans"
        d="flex"
        justifyContent={{base:"space-between"}}
        alignItems="center"
        >
            <IconButton 
            d={{base:"flex",md:"none"}}
            icon={<ArrowBackIcon/>}
            onClick={()=>setSelectedChat("")}
            />
              {!selectedChat.isGroupChat?(
                <>{getSender(user,selectedChat.users)}
                <ProfileModal user={getSenderFull(user,selectedChat.users)}/>
                </>
              ):(
                <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                />
                </>
              )}

        </Text>
        <Box 
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
        >

          {!loading ? (
          <Spinner
           size="xl"
           w={20}
           h={20}
           alignself="center"
           margin="auto"
           /> 
           ):(
           <div>Messages</div>
           )}

           <FormControl onKeyDown={sendMessage} isRequired mt={3}>
            <Input 
            variant="filled"
            bg="E0E0E0"
            placeholder="enter the message..."
            onChange={typingHandler}
            value={newMessage}
            />
           </FormControl>
        </Box>
        </>
    ):(
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
            <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                Click on a user to start chatting
            </Text>
        </Box>
    )}
    </>
  )
}

export default SingleChat