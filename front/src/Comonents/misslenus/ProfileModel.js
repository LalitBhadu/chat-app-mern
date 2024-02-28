import { Button, IconButton, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'
import { GiBleedingEye } from "react-icons/gi";
import { Image } from "@chakra-ui/react"
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react'


const ProfileModel = ({ user, children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()


    return (
        <>
        {
            children ? (
            <span onClick={onOpen}>{children}</span>)
             : (
                <IconButton
                display={{base:'flex'}}
                icon={<GiBleedingEye />}
                onClick={onOpen}
                />
             )}
             <Modal size='lg' isCentered
             isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h='300px' w='90%'>
          <ModalHeader 
          fontSize='40px'
          fontFamily='Work sans'
          display='flex'
          justifyContent='center'
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display="flex"
          flexDirection='column'
          alignItems="center"
          justifyContent='space-between'
          >
          <Image
          borderRadius='full'
          boxSize='50px'
          src={user.pic}
          alt={user.name}
          display='flex'
          />
          
          <Text
          fontSize={{base:"20px", md: "20px"}}
          fontFamily="Work sans"
          >
            Email: {user.email}
          </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

        </>
    );
};

export default ProfileModel
