import React, { useState } from 'react'
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    useToast,
    FormControl,
    Input,
    Box,
  } from '@chakra-ui/react'
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import * as mod from '../../url';
import UserListItem from '../userAvtar/UserListItem';
import UserBadgeItem from '../userAvtar/UserBadgeItem';
// import { UserBadgeItem } from '@chakra-ui/icons'





const GroupChatModal = ({children}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);


    const toast = useToast();

    const { user, chats, setChats } = ChatState();


    const handleSearch =async (search) => {
      if(!search){
        toast({
            title: 'Please Enter any Name for search.',
            status: 'warning',
            duration: 3000,
            isClosable: true,
            position:"top-left"
          });
          return;
    }

    try{
        setLoading(true)

        const config = {
            headers:{
                Authorization:`Bearer ${user.token}`,
            },
        };

        const { data } = await axios.get(`${mod.api_url}/api/user?search=${search}`, config);
        // console.log(data);
        setLoading(false);
        setSearchResult(data);

    } catch (error){
        toast({
            title: 'Error Occured',
            description:"faild to load the Search data",
            status: 'error',
            duration: 2000,
            isClosable: true,
            position:"Bottom-left"
          });
    };

    };

    const handleSubmit = async() => {
      if (!groupChatName || !selectedUsers) {
        toast({
          title: 'Please fill all fileds.',
          status: 'warning',
          duration: 3000,
          isClosable: true,
          position:"top"
        });
        return;
      }
      try {

        const config = {
            headers:{
              "Content-type": "application/json",
                Authorization:`Bearer ${user.token}`,
            },
        };


        const { data } = await axios.post(`${mod.api_url}/api/userchat/group`, {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map(u => u._id)),
        },
        config
        );
        console.log(data, "group create");
        setChats([data,...chats]);
        onClose();
        toast({
          title: 'New Group Created.',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position:"top"
        });
        
      } catch (error) {
        toast({
          title: 'Error.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position:"Bottom-left"
        });
        
      }
    };
    
    const handleGroup = (userToAdd) =>{
      if(selectedUsers.includes(userToAdd)){
        toast({
          title: 'User Already Added',
          status: 'warning',
          duration: 2000,
          isClosable: true,
          position:"top"
        });
        return;
      }

      setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleDelete = (deleteUser) => {
      setSelectedUsers(selectedUsers.filter(sel => sel._id !==deleteUser._id))
    }


    return (
        <>
              <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w='95%'>
          <ModalHeader
          fontSize='30px'
          fontFamily='work sans'
          display='flex'
          justifyContent='center'
          >Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
          display='flex'
          flexDir='column'
          alignItems='center'
          >
          <FormControl>
            <Input 
                placeholder='Chat Name'
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <Input 
                placeholder='Add users eg: Sandeep, Lalit, Vishal, Subu, Kavita etc.'
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
            />
          </FormControl>
          <Box
          w='100%'
          display='flex'
          flexWrap='wrap' 
          >
          {selectedUsers.map(u =>(
            <UserBadgeItem key={user._id} user={u} 
              handleFunction={() => handleDelete(u)}
            />
          ))}
          </Box>
         
          {/* render hear serch users reslt */}
          {loading ? <div>Loading...</div>: (
             searchResult?.slice(0, 10).map(user => (
              <UserListItem 
              key={user._id} user={user} handleFunction={() => handleGroup(user)} />
             ))
          )}
          </ModalBody>

          <ModalFooter>
            <Button 
            colorScheme='blue'
             mr={3} 
             onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </>
    )
}

export default GroupChatModal
