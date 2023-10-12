import React from 'react';
import { IconButton } from '@chakra-ui/button';
import {useDisclosure} from "@chakra-ui/hooks"
import { ViewIcon } from '@chakra-ui/icons';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from '@chakra-ui/react';

const UpdateGroupChatModal = ({fetchAgain,setFetchAgain}) => {
    const {isOpen,onOpen,onClose}=useDisclosure();

  return (
    <>
    <IconButton d={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>
    <Modal isOpen ={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton/>
            <ModalBody>
              
                
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
             
            </ModalFooter>
           
        </ModalContent>
    </Modal>
    </>
  )
}

export default UpdateGroupChatModal