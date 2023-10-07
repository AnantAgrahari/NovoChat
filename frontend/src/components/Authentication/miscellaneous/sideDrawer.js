import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, MenuItem, MenuList, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React,{useState} from 'react';
import {Box,Text} from "@chakra-ui/react";
import { Button } from '@chakra-ui/react';
import { Menu,MenuButton } from '@chakra-ui/react';
import {BellIcon,ChevronDownIcon} from "@chakra-ui/icons";
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/hooks';
import ChatLoading from '../../ChatLoading';
import axios from 'axios';

const sideDrawer = () => {
  const [search,setSearch]=useState("");
  const [searchResult,setSearchResult]=useState([]);
  const [loading,setLoading]=useState(false);
  const [loadingChat, setLoadingChat]=useState();

  const { user,setSelectedChat,chats,setChats} = ChatState();
  const history=useHistory();
  const {isOpen,onOpen,onClose}=useDisclosure();

  
  const logoutHandler=()=>{
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const toast=useToast();

  const handleSearch=async()=>{                                 //this is to handle search when we search the user in the searchbar for new chat// 
    if(!search){                                          //after searching,if there is no result,then display the following error//
      toast({
        title:"Please enter something in search",
        status:"warning",
        duration:5000,
        isClosable:true,
        position:"top-left",
      });
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
      })
    }
  };

   const accessChat=async(userId)=>{              //this is used when we click to start any new chat in the search user sidebar//

    try {
      setLoadingChat(true);
      const config={
        headers:{
          "Content-type":"application/json",
          Authorization:`Bearer ${user.token}`,
        },
      };

      const {data}=await axios.post('/api/chat',{userId},config);      //api request for chat to start//
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } 
    catch (error) {
      toast({
        title:"Error Occured",
        description:error.message,
        status:"error",
        duration:5000,
        isClosable:true,
        position:"bottom-left",
      })
    }

   };

  return (
    <><Box>
      <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">
        <Button variant="ghost" onClick={onOpen}>
          <i class="fas fa-search"></i>
          <Text d={{ base: "none", md: "flex" }} px='4'>
            Search User
          </Text>
        </Button>
      </Tooltip>
      <Text fontSize="2xl" fontFamily="Work sans">
        Talk-A-Tive
      </Text>
      <div>
        <Menu>
          <MenuButton p={1}>
            <BellIcon fontSize="2xl" m={1} />
          </MenuButton>
          {/* <MenuList></MenuList> */}
        </Menu>
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
          >
            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuDivider />
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </div>

    </Box>
    
  <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
    <DrawerOverlay/>
    <DrawerContent>
      <DrawerHeader borderBottomWidth="1px">Search users</DrawerHeader>
      <DrawerBody>
      <Box d="flex" pb={2}>

        <Input
        placeholder='search by name or email'
        mr={2}
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        />
        <Button onClick={handleSearch}>Go</Button>
      </Box>
      {loading ? (<ChatLoading/>):(
        searchResult?.map((user)=>(
          <UserListItem
          key={user._id}
         user={user}
          handleFunction={()=>accessChat(user._id)}    //creates a chat with user._id//
          />
        ))
      )}
    </DrawerBody>
    </DrawerContent>
   
    </Drawer>
    </>
    

   
  )
}

export default sideDrawer;

//tooltip icon shows text when u hover over a particular button or option//