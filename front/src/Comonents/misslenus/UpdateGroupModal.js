import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { FaBell } from 'react-icons/fa';
import { ChatState } from '../../context/ChatProvider';
import UserBadgeItem from '../userAvtar/UserBadgeItem';
import axios from 'axios';
import * as mod from '../../url';
import UserListItem from '../userAvtar/UserListItem';


const UpdateGroupModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [reNameLoading, setReNameLoading] = useState(false);

    const toast = useToast()


    const { user, selectedChat, setSelectedChat } = ChatState();

    const { isOpen, onOpen, onClose } = useDisclosure();

//fun for remove
     const handleAddUser =async (user1) =>{
        if (selectedChat.users.find((u) => u._id ===  user1._id)) {
            toast({
                title: 'User Already in group',
                status: 'error',
                duration: 2000,
                isClosable: true,
                position:"bottom"
              });
              return;
        }
        
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: 'Only Admin can Add some One',
                status: 'error',
                duration: 2000,
                isClosable: true,
                position:"bottom"
              });
              return;
        }

        try {
            setLoading(true);

            
      const config = {
          headers:{
              Authorization:`Bearer ${user.token}`,
          },
      };

      const { data } = await axios.put(`${mod.api_url}/api/userchat/groupadd`,{
        chatId: selectedChat._id,
        userId: user1._id,
      },
      config
      );
            setSelectedChat(data);
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            toast({
                title: 'Only Admin can Add some One',
                status: 'error',
                duration: 2000,
                isClosable: true,
                position:"bottom"
              });
              setLoading(false)

        }


     }


 //fun for remove
    const handleRemove =async (user1) =>{

        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast({
                title: 'Only Admin can remove user',
                status: 'error',
                duration: 2000,
                isClosable: true,
                position:"bottom"
              });
              return;
        }

        try {
            setLoading(true);

            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put(`${mod.api_url}/api/userchat/groupremove`, {
                chatId: selectedChat._id,
                userId: user1._id,
            }, 
            config
            );
    
            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            toast({
                title: 'Error on Remove user',
                status: 'error',
                duration: 2000,
                isClosable: true,
                position:"bottom"
              });
        };


    }



//fun for rename
    const handlRename =async () =>{
        if (!groupChatName) return

        try {
            setReNameLoading(true)

            const config = {
                headers:{
                    "Content-type": "application/json",
                    Authorization:`Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put(`${mod.api_url}/api/userchat/rename`, {
                chatId:selectedChat._id,
                chatName:groupChatName,
            },
            config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setReNameLoading(false);

        } catch (error) {
            toast({
                title: 'Error Occured',
                description:"Faild to Rename data",
                status: 'error',
                duration: 2000,
                isClosable: true,
                position:"bottom"
              });
              setReNameLoading(false);
        }
        setGroupChatName('');

    }


//fun for search
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
      console.log(data);
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



    return (
        <>
            <IconButton display={{ base:"flex"}} onClick={onOpen} icon={<ViewIcon />} />

<Modal isOpen={isOpen} onClose={onClose}
isCentered
>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader
    fontSize='35px'
    fontFamily='Work sans'
    display='flex'
    justifyContent='center'
    >{selectedChat.chatName}</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
    <Box
    w='100%'
    display='flex'
    flexWrap='wrap'
    pb={3}
    >
    {selectedChat.users.map(u => (
        <UserBadgeItem
        key={user._id}
        user={u}
        handleFunction={() => handleRemove(u)}
         />
    ))}
    </Box>
    <FormControl display='flex'>
    <Input 
        placeholder='Chat Name'
        mb={3}
        value={groupChatName}
        onChange={(e) => setGroupChatName(e.target.value)}
    />
    <Button
    variant='solid'
    colorScheme='teal'
    ml={1}
    isLoading={reNameLoading}
    onClick={handlRename}
    >
        Update
    </Button>
    </FormControl>
    <FormControl>
              <Input
                placeholder="Add User to group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleAddUser(user)}
                />
              ))
            )}
    </ModalBody>

    <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
  </ModalContent>
</Modal>
        </>
    )
}

export default UpdateGroupModal
