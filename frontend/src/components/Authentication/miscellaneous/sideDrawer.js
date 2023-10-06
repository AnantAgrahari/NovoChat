import { MenuItem, MenuList, Tooltip } from '@chakra-ui/react';
import React,{useState} from 'react';
import {Box,Text} from "@chakra-ui/react";
import { Button } from '@chakra-ui/react';
import { Menu,MenuButton } from '@chakra-ui/react';
import {BellIcon,ChevronDownIcon} from "@chakra-ui/icons";

const sideDrawer = () => {
  const [search,setSearch]=useState("");
  const [searchResult,setSearchResult]=useState([]);
  const [loading,setLoading]=useState(false);
  const [loadingChat, setLoadingChat]=useState();
  const { user } = ChatState();

  return (
    <Box>    
       <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">         
        <Button variant="">
            <i class ="fas fa-search"></i>
            <Text d={{base:"none",md:"flex"}} px='4'>
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
            <BellIcon fontSize="2xl" m={1}/>
          </MenuButton>
          {/* <MenuList></MenuList> */}
        </Menu>
        <Menu>
          <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon/>}
          >
            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}/>
          </MenuButton>
          <MenuList>                          
            <MenuItem>My Profile</MenuItem>
            <MenuDivider/>
            <MenuItem>Logout</MenuItem>
          </MenuList>
        </Menu>
       </div>

    </Box>
  )
}

export default sideDrawer;

//tooltip icon shows text when u hover over a particular button or option//