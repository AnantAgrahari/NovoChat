import { Modal,ModalBody,ModalCloseButton,ModalContent,ModalFooter,ModalHeader,ModalOverlay,Button,useToast,Input, Box } from '@chakra-ui/react';
import React from 'react';
import { useDisclosure } from '@chakra-ui/hooks';
import { ChatState } from '../../../Context/ChatProvider';
import { FormControl } from '@chakra-ui/form-control';
import UserListItem from '../../UserAvatar/UserListItem';
import UserBadgeItem from '../../UserAvatar/UserBadgeItem';
import { useState } from 'react';
import axios from 'axios';

const GroupChatModal = ({children}) => {
    const {isOpen,onOpen,onClose}=useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const {user,chats,setChats}=ChatState();
    const handleSearch=async(query)=>{
        setSearch(query);
        if(!query){
            return;
        }

        try {
            setLoading(true);
            
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };

        const {data}=await axios.get(`/api/user?search=${search}`,config);
        console.log(data);
        setLoading(false);
        setSearchResult(data);


        } catch (error) {
              toast({
        title:"Error Occured",
        description:"Failed to load the search results",
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom-left",
      });
        }

    };




    const handleSubmit=async()=>{
        if(!groupChatName || !selectedUsers){
            toast({
                title:"Please fill all the fields",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top",
            });
            return;
        }
         
        try {
            const config={
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };
    
         const {data}=await axios.post("/api/chat/group",{
            name:groupChatName,
            users:JSON.stringify(selectedUsers.map((u)=>u._id)),

         },
         config
         ); 
         setChats([data,...chats]);
         onClose();
         toast({
            title:"New group chat created",
                status:"success",
                duration:5000,
                isClosable:true,
                position:"bottom",
         });

        } catch (error) {
            toast({
                title:"Failed to create the chat",
                description:error.response.data,
                    status:"error",
                    duration:5000,
                    isClosable:true,
                    position:"bottom",
             });
        }

    };



    const handleDelete=(delUser)=>{
        setSelectedUsers(selectedUsers.filter((sel)=>sel._id!==delUser._id)
        );
    };
    const handleGroup=(userToAdd)=>{
        if(selectedUsers.includes(userToAdd)){
            toast({
                title:"user already added",
                status:"warning",
                duration:5000,
                isClosable:true,
                position:"top",
            });
            return;
        }
        setSelectedUsers([...selectedUsers,userToAdd]);
    };


  return (
    <>
    <span onClick={onOpen}>{children}</span>
    <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
            <ModalHeader 
              fontSize="35px"
              fontFamily="Work sans"
              d="flex"
              justifyContent="center"

            >
                Create Group Chat</ModalHeader>
            <ModalCloseButton/>
            <ModalBody d="flex" flexDir="column" alignItems="center">
               <FormControl>
                <Input 
                placeholder="Chat Name"
                 mb={3}
                 onChange={(e)=>setGroupChatName(e.target.value)}
                 />
               </FormControl>
               <FormControl>
                <Input 
                placeholder="Add users eg: John,Piyush,Jane"
                 mb={1}
                 onChange={(e)=>handleSearch(e.target.value)}
                 />
               </FormControl>
                
                <Box w="100%" d="flex" flexWrap="wrap" >
                {selectedUsers.map((u)=>(
                    <UserBadgeItem key={user._id} user={u}
                    handleFunction={()=>handleDelete(u)}
                    />
                ))}
                </Box>




              {loading ? <div>loading</div>:(
                searchResult?.slice(0,4).map(user=>(
                    <UserListItem 
                    key={user._id}
                    user={user}
                    handleFunction={()=>handleGroup(user)}
                    />
                ))
              )}


            </ModalBody>
            <ModalFooter>
                <Button colorScheme="blue"  onClick={handleSubmit}>
                    Close
                </Button>
                
            </ModalFooter>
        </ModalContent>
    </Modal>
    </>
  )
}

export default GroupChatModal