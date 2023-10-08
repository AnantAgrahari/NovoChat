import { Modal,ModalBody,ModalCloseButton,ModalContent,ModalFooter,ModalHeader,ModalOverlay,Button } from '@chakra-ui/react';
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
                <Input/>
               </FormControl>
            </ModalBody>
            <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                    Close
                </Button>
                <Button variant="ghost">Secondary Action</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>
    </>
  )
}

export default GroupChatModal