import { Modal,ModalBody,ModalCloseButton,ModalContent,ModalFooter,ModalHeader,ModalOverlay,Button,useToast,Input } from '@chakra-ui/react';
import React from 'react';
import { useDisclosure } from '@chakra-ui/hooks';
import { ChatState } from '../../../Context/ChatProvider';
import { FormControl } from '@chakra-ui/form-control';

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
            const {data}=await axios.get(`/api/user?search ${search}`,config);
            console.log(data);
            setLoading(false);
            setSearchResult(data);


        } catch (error) {
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




    const handleSubmit=()=>{};


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
                  {/* selected Users */}
                  {/* render searched users */}


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